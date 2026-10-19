import { NextRequest, NextResponse } from 'next/server';

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

        // Check cache first
        if (pincodeCache.has(cleanCode)) {
            const cached = pincodeCache.get(cleanCode)!;
            return NextResponse.json({
                success: true,
                data: {
                    pincode: cleanCode,
                    city: cached.city,
                    state: cached.state,
                    source: 'cache'
                }
            });
        }

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
                    const city = po.District || po.Division || po.Block || po.Name || '';
                    const state = po.State || '';

                    if (city && state) {
                        pincodeCache.set(cleanCode, { city, state });
                        return NextResponse.json({
                            success: true,
                            data: {
                                pincode: cleanCode,
                                city,
                                state,
                                district: po.District,
                                source: 'india-post'
                            }
                        });
                    }
                }
            }
        } catch (fetchErr) {
            console.warn(`Primary pincode fetch failed for ${cleanCode}:`, fetchErr);
        }

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
                    const city = place['place name'] || '';
                    const state = place['state'] || '';

                    if (city && state) {
                        pincodeCache.set(cleanCode, { city, state });
                        return NextResponse.json({
                            success: true,
                            data: {
                                pincode: cleanCode,
                                city,
                                state,
                                source: 'zippopotam'
                            }
                        });
                    }
                }
            }
        } catch (fallbackErr) {
            console.warn(`Fallback pincode fetch failed for ${cleanCode}:`, fallbackErr);
        }

        return NextResponse.json(
            { success: false, message: 'Pincode not found. Please enter city and state manually.' },
            { status: 404 }
        );

    } catch (error) {
        console.error('Pincode route error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to lookup pincode' },
            { status: 500 }
        );
    }
}
