import { z } from 'zod'
export const credentialForm = z.object({
    HotelName: z.string().min(2, 'Hotel Name is required'),
    UserName: z.string().min(2, 'UserName is required'),
    Password: z.string().min(6, 'Password must be at least 6 characters long'),
    LogoUrl: z.string().min(2, 'Logo URL is required')
})
