import Head from 'next/head'

export default function Home() {
  return (
    <div className='container'>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Hello world
    </div>
  )
}
