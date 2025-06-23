"use server"

export async function submitContactForm(formData: FormData) {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Basic server-side validation
  if (!name || !email || !subject || !message) {
    return {
      success: false,
      message: "All fields are required.",
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please provide a valid email address.",
    }
  }

  // In a real application, you would:
  // 1. Save to database
  // 2. Send email notification
  // 3. Integrate with email service (SendGrid, Mailgun, etc.)
  // 4. Add spam protection (reCAPTCHA)

  console.log("Contact form submission:", {
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
  })

  // Simulate occasional errors for demonstration
  if (Math.random() < 0.1) {
    return {
      success: false,
      message: "There was an issue sending your message. Please try again.",
    }
  }

  return {
    success: true,
    message: `Thank you, ${name}! Your message has been sent successfully. I'll get back to you within 24 hours.`,
  }
}
