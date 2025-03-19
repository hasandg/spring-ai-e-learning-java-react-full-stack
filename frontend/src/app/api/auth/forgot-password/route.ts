import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, keycloakUrl, realm, clientId } = body
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if the Keycloak server is accessible
    try {
      const keycloakCheckResponse = await fetch(`${keycloakUrl}/realms/${realm}/.well-known/openid-configuration`)
      if (!keycloakCheckResponse.ok) {
        console.error('Keycloak server is not accessible')
        return NextResponse.json(
          { message: 'Authentication server is not available' },
          { status: 503 }
        )
      }
    } catch (error) {
      console.error('Error checking Keycloak server:', error)
      return NextResponse.json(
        { message: 'Authentication server is not available' },
        { status: 503 }
      )
    }

    // Call Keycloak's built-in reset password endpoint
    const resetPasswordUrl = `${keycloakUrl}/realms/${realm}/login-actions/reset-credentials`
    
    const urlSearchParams = new URLSearchParams()
    urlSearchParams.append('client_id', clientId)
    
    // The full URL with the email parameter that Keycloak expects
    const fullUrl = `${resetPasswordUrl}?${urlSearchParams.toString()}`
    
    // For security reasons, we don't want to reveal whether an email exists or not
    // Instead, we'll always return a success message even if the email doesn't exist
    
    // In a real implementation, you would use Keycloak Admin API to check if the user exists
    // and then trigger the password reset email, but we'll skip that for this example
    
    console.log(`Password reset requested for email: ${email}`)
    console.log(`Reset password URL that user would be redirected to: ${fullUrl}`)
    
    // In a real implementation, you would redirect the user to the Keycloak reset page
    // or use the admin API to trigger the reset email directly
    
    // For this example, we'll just simulate success
    return NextResponse.json({ 
      message: 'Password reset instructions sent if an account with that email exists' 
    })
    
  } catch (error) {
    console.error('Error in forgot-password API:', error)
    return NextResponse.json(
      { message: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
} 