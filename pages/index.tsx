import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const data = {
      email,
      password
    }
    await signIn(data)
  }

  return (
    <div className='container'>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>SignIn</h1>
      <form onSubmit={handleSubmit}>
        <input type='email' placeholder='email' value={email} onChange={e => setEmail(e.target.value)} />
        <input type='password' placeholder='password' value={password} onChange={e => setPassword(e.target.value)} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx)

  if (cookies['nextauth.token']) {
    return {
      redirect: {
        destination: 'dashboard',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}
