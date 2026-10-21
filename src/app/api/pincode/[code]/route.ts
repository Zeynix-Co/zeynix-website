import { NextRequest, NextResponse } from 'next/server';
import { checkShiprocketServiceability } from '@/lib/services/shiprocket';

// In-memory cache to store resolved pincodes
const pincodeCache = new Map<string, { city: string; state: string }>();

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await context.params;
        const cleanCode = (code || '').trim();

        if (!/^\d{6}$/.test(cleanCode)) {
            return NextResponse.json(
                { success: false, message: 'Please provide a valid 6-digit pincode' },
                { status: 400 }
            );
        }

        // 1. Check Courier Serviceability with Shiprocket
        const shiprocketResult = await checkShiprocketServiceability(cleanCode);

        // If Shiprocket is configured and explicitly says NOT serviceable, block right away!
        if (shiprocketResult.configured && !shiprocketResult.serviceable) {
            return NextResponse.json(
                {
                    success: false,
                    serviceable: false,
                    configured: true,
                    message: shiprocketResult.message || `Delivery is not available to pincode ${cleanCode}.`,
                    data: {
                        pincode: cleanCode,
                        serviceable: false,
                    },
                },
                { status: 422 }
            );
        }

        // 2. Resolve City & State (Cache -> India Post -> Zippopotam)
        let resolvedCity = '';
        let resolvedState = '';

        if (pincodeCache.has(cleanCode)) {
            const cached = pincodeCache.get(cleanCode)!;
            resolvedCity = cached.city;
            resolvedState = cached.state;
        }

        if (!resolvedCity || !resolvedState) {
            // Primary Provider: India Post API
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000);

                const res = await fetch(`https://api.postalpincode.in/pincode/${cleanCode}`, {
                    signal: controller.signal,
                    headers: { 'Accept': 'application/json' },
                    next: { revalidate: 86400 } // Cache at fetch level for 24h
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice) && data[0].PostOffice.length > 0) {
                        const po = data[0].PostOffice[0];
                        resolvedCity = po.District || po.Division || po.Block || po.Name || '';
                        resolvedState = po.State || '';

                        if (resolvedCity && resolvedState) {
                            pincodeCache.set(cleanCode, { city: resolvedCity, state: resolvedState });
                        }
                    }
                }
            } catch (fetchErr) {
                console.warn(`Primary pincode fetch failed for ${cleanCode}:`, fetchErr);
            }
        }

        if (!resolvedCity || !resolvedState) {
            // Fallback Provider: Zippopotam
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3500);

                const resFallback = await fetch(`https://api.zippopotam.us/in/${cleanCode}`, {
                    signal: controller.signal,
                    headers: { 'Accept': 'application/json' }
                });
                clearTimeout(timeoutId);

                if (resFallback.ok) {
                    const dataFallback = await resFallback.json();
                    const place = dataFallback?.places?.[0];
                    if (place) {
                        resolvedCity = place['place name'] || '';
                        resolvedState = place['state'] || '';

                        if (resolvedCity && resolvedState) {
                            pincodeCache.set(cleanCode, { city: resolvedCity, state: resolvedState });
                        }
                    }
                }
            } catch (fallbackErr) {
                console.warn(`Fallback pincode fetch failed for ${cleanCode}:`, fallbackErr);
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                pincode: cleanCode,
                city: resolvedCity,
                state: resolvedState,
                serviceable: true,
                configured: shiprocketResult.configured,
                courierName: shiprocketResult.courierName,
                estimatedDeliveryDays: shiprocketResult.estimatedDeliveryDays,
                codAvailable: shiprocketResult.codAvailable,
                message: shiprocketResult.message,
            }
        });

    } catch (error) {
        console.error('Pincode route error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to lookup pincode' },
            { status: 500 }
        );
    }
}
