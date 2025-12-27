import { z } from 'zod'
export const credentialForm = z.object({
    HotelName: z.string().min(2, 'Hotel Name is required'),
    UserName: z.string().min(2, 'UserName is required'),
    Password: z.string().min(6, 'Password must be at least 6 characters long'),
    LogoUrl: z.string().min(2, 'Logo URL is required')
})

export const ContactForm = z.object({
    Full_Name: z.string().min(2, "Please Enter Your name"),
    Email: z.email("Please Enter Valid Email"),
    Subject: z.string().min(2, "Please Enter Subject"),
    Message: z.string().min(2, "Please Enter Message")
})
