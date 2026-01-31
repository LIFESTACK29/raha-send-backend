import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {
    @ApiProperty({ example: 'addr_123456789' })
    addressId: string;

    @ApiProperty({ example: 'Lagos' })
    city: string;

    @ApiProperty({ example: 'Lagos' })
    state: string;

    @ApiProperty({ example: 'NG' })
    country: string;

    @ApiProperty({ example: '123 Main St' })
    line1: string;

    @ApiProperty({ example: 'Apt 4B', required: false })
    line2?: string;

    @ApiProperty({ example: '100001' })
    zip: string;

    @ApiProperty({ example: '+2348012345678' })
    phone: string;

    @ApiProperty({ example: 'john.doe@example.com', required: false })
    email?: string;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: true })
    is_residential: boolean;

    @ApiProperty({ example: { key: 'value' }, required: false })
    metadata?: any;
}
