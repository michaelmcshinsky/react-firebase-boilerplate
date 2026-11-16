import { z } from 'zod'

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .email('Enter a valid email address.')

export const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(72, 'Passwords must be 72 characters or fewer.')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
})

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, 'Enter your name.')
      .max(60, 'Keep it under 60 characters.'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const profileSchema = z.object({
  displayName: z.string().trim().min(2, 'Enter your name.').max(60, 'Keep it under 60 characters.'),
  firstName: z.string().trim().max(40, 'Keep it under 40 characters.'),
  lastName: z.string().trim().max(40, 'Keep it under 40 characters.'),
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ProfileValues = z.infer<typeof profileSchema>
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>
