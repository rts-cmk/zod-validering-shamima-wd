
import { useState } from 'react'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1, 'Too small: expected string to have >=1 characters'),
  lastName: z.string().min(1, 'Too small: expected string to have >=1 characters'),
  password: z.string().min(8, 'Too small: expected string to have >=8 characters'),
  confirmPassword: z.string(),
  email: z.string().email('Invalid email address'),
  phone: z.coerce.number({
    invalid_type_error: 'Invalid input: expected number, received string',
  }),
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

export default function App() {
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.target))

    const result = schema.safeParse(formData)

    if (!result.success) {
      const fieldErrors = {}
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
    } else {
      setErrors({})
      alert('User created successfully')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Personlige oplysninger</h2>

      <label>Fornavn</label>
      <input name="firstName" />
      {errors.firstName && <p>• {errors.firstName}</p>}

      <label>Efternavn</label>
      <input name="lastName" />
      {errors.lastName && <p>• {errors.lastName}</p>}

      <label>Adgangskode</label>
      <input type="password" name="password" />
      {errors.password && <p>• {errors.password}</p>}

      <label>Gentag adgangskode</label>
      <input type="password" name="confirmPassword" />
      {errors.confirmPassword && <p>• {errors.confirmPassword}</p>}

      <label>Email</label>
      <input name="email" />
      {errors.email && <p>• {errors.email}</p>}

      <label>Telefon</label>
      <input name="phone" />
      {errors.phone && <p>• {errors.phone}</p>}

      <button>Opret bruger</button>
    </form>
  )
}
