import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

function Campaigns() {
  const campaigns = [
    {
      id: 1,
      title: "Yeni Üyelere Özel",
      description: "İlk alışverişinizde %15 indirim fırsatı",
      image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
      endDate: "2024-04-01"
    },
    {
      id: 2,
      title: "Sezon Sonu İndirimi",
      description: "Seçili ürünlerde net %50 indirim",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      endDate: "2024-03-15"
    },
    // Diğer kampanyalar...
  ]

  return (
    <div className="bg-cream-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl text-brown-800 mb-8">Kampanyalar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="relative h-80 rounded-lg overflow-hidden group">
              <img 
                src={campaign.image} 
                alt={campaign.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-cream-50 p-6">
                  <h3 className="font-serif text-3xl mb-2">{campaign.title}</h3>
                  <p className="text-lg font-light mb-6">{campaign.description}</p>
                  <p className="text-sm mb-4">Son Geçerlilik: {new Date(campaign.endDate).toLocaleDateString('tr-TR')}</p>
                  <Link 
                    to={`/kampanya/${campaign.id}`}
                    className="inline-block bg-cream-50 text-brown-800 px-8 py-3 rounded-lg hover:bg-cream-100 transition-colors"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Campaigns 