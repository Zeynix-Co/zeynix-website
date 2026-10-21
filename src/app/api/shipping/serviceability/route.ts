import { NextRequest, NextResponse } from 'next/server';
import { checkShiprocketServiceability } from '@/lib/services/shiprocket';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pincode = searchParams.get('pincode')?.trim();
        const weight = parseFloat(searchParams.get('weight') || '0.5');
        const cod = searchParams.get('cod') === '1' || searchParams.get('cod') === 'true';

        if (!pincode || !/^\d{6}$/.test(pincode)) {
            return NextResponse.json(
                { success: false, message: 'Please provide a valid 6-digit pincode' },
                { status: 400 }
            );
        }

        const result = await checkShiprocketServiceability(pincode, weight, cod);

        if (result.configured && !result.serviceable) {
            return NextResponse.json({
                success: false,
                serviceable: false,
                configured: true,
                message: result.message || `Delivery is not available to pincode ${pincode}.`,
                data: result,
            });
        }

        return NextResponse.json({
            success: true,
            serviceable: result.serviceable,
            configured: result.configured,
            data: result,
        });
    } catch (error) {
        console.error('Shiprocket serviceability API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to check shipping serviceability' },
            { status: 500 }
        );
    }
}
