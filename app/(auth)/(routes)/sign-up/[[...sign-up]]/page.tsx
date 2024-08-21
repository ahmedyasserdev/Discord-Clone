import { SignUp } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata : Metadata = {
  title: 'Sign up',
}

const SignUpPage = () => {
  return (
    <SignUp />
  )
}

export default SignUpPage