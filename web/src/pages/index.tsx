interface HomeProps {

}

import Image from 'next/image'
import whiteBayeuxLogo from '../assets/logoBayeuxBranca.png'

export default function Home(props: HomeProps) {
  return (
    <div>
      <main></main>

      <Image src={whiteBayeuxLogo} alt="Logo da Etec. Prof. Armando Bayeux da Silva" />
    </div>
  )
}
