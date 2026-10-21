// Shiprocket Courier Serviceability and Authentication Service

interface ShiprocketAuthCache {
    token: string;
    expiresAt: number; // Unix timestamp in ms
}

let authCache: ShiprocketAuthCache | null = null;

export interface ServiceabilityResponse {
    configured: boolean;
    serviceable: boolean;
    pincode: string;
    city?: string;
    state?: string;
    courierName?: string;
    courierCompanyId?: number;
    estimatedDeliveryDays?: string;
    etd?: string;
    codAvailable?: boolean;
    rate?: number;
    message?: string;
}

/**
 * Returns the cached Shiprocket JWT token or logs in to generate a fresh one.
 * Shiprocket tokens typically expire in 10 days; we cache for 8 days to be safe.
 */
export async function getShiprocketToken(): Promise<string | null> {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
        return null;
    }

    const now = Date.now();
    if (authCache && authCache.expiresAt > now) {
        return authCache.token;
    }

    try {
        const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            console.error('Shiprocket login failed with status:', response.status);
            return null;
        }

        const data = await response.json();
        if (data.token) {
            // Cache token for 8 days (8 * 24 * 60 * 60 * 1000 ms)
            authCache = {
                token: data.token,
                expiresAt: now + 8 * 24 * 60 * 60 * 1000,
            };
            return data.token;
        }

        return null;
    } catch (error) {
        console.error('Shiprocket auth error:', error);
        return null;
    }
}

/**
 * Checks courier serviceability for a delivery pincode from the configured warehouse pickup pincode.
 */
export async function checkShiprocketServiceability(
    deliveryPincode: string,
    weight: number = 0.5,
    isCod: boolean = false
): Promise<ServiceabilityResponse> {
    const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE;

    // Check if Shiprocket credentials are fully configured
    const token = await getShiprocketToken();
    if (!token || !pickupPincode) {
        return {
            configured: false,
            serviceable: true,
            pincode: deliveryPincode,
            message: 'Shiprocket credentials not configured; default delivery accepted.',
        };
    }

    try {
        const url = new URL('https://apiv2.shiprocket.in/v1/external/courier/serviceability/');
        url.searchParams.set('pickup_postcode', pickupPincode.trim());
        url.searchParams.set('delivery_postcode', deliveryPincode.trim());
        url.searchParams.set('cod', isCod ? '1' : '0');
        url.searchParams.set('weight', weight.toString());

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        // Shiprocket returns available_courier_companies array when serviceable
        const couriers = data?.data?.available_courier_companies || [];
        const isServiceable = response.ok && couriers.length > 0;

        if (isServiceable) {
            // Pick top rated or recommended courier (first entry is usually default recommended)
            const topCourier = couriers[0];
            const courierName = topCourier?.courier_name || 'Express Courier';
            const etd = topCourier?.etd || topCourier?.estimated_delivery_days || '3-5 Days';
            const codAvailable = Boolean(topCourier?.cod === 1);
            const rate = topCourier?.rate || 0;

            return {
                configured: true,
                serviceable: true,
                pincode: deliveryPincode,
                courierName,
                courierCompanyId: topCourier?.courier_company_id,
                estimatedDeliveryDays: typeof etd === 'number' ? `${etd} business days` : etd,
                etd: typeof etd === 'number' ? `${etd} business days` : etd,
                codAvailable,
                rate,
                message: `Delivery available via ${courierName}`,
            };
        }

        // Not serviceable by any courier
        return {
            configured: true,
            serviceable: false,
            pincode: deliveryPincode,
            message: `Delivery is currently not available to pincode ${deliveryPincode}.`,
        };
    } catch (error) {
        console.error('Shiprocket serviceability check error:', error);
        // Fail-safe: In case of temporary network glitch, allow graceful degradation
        return {
            configured: true,
            serviceable: true,
            pincode: deliveryPincode,
            message: 'Serviceability check timeout; standard delivery will be processed.',
        };
    }
}
