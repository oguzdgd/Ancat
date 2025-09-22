import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" className='border-2' required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required  
      className='border-2'/>
      <button formAction={login} className='font-bold py-2 px-4 rounded  bg-blue-500 text-white'>Log in</button>
      <button formAction={signup} className='font-bold py-2 px-4 rounded  bg-blue-500 text-white'>Sign up</button>
    </form>
  )
}