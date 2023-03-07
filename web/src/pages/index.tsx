interface HomeProps {

}

import Layout from './layout'
import AdminPanel from './users/AdminPanel'

export default function Home(props: HomeProps) {
  return (
    <div>
      <Layout />
      <AdminPanel />
    </div>
  )
}
