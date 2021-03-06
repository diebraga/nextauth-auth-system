import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { setupAuthClient } from "../services/api"
import { api } from "../services/apiClient"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
  const { user } = useAuth()

  useEffect(() => {
    api.get('/me').then(response => 
      console.log(response)).catch(error => {
        alert(JSON.stringify(error))
      })
  })
  return (
    <h1>Dashboard {user?.email}</h1>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAuthClient(ctx)
  const response = await apiClient.get('/me')

  console.log(response.data)
  return {
    props: {}
  }
})

