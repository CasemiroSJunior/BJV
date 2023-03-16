interface HomeProps {

}

import Layout from './layout'
import LayoutBottom from './layoutBottom'
import Vacancy from './vacancy/VacancyList'

export default function Home(props: HomeProps) {
  return (
    <div>
      <Layout />
      
      <LayoutBottom />
    </div>
  )
}
