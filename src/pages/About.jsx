import { FaEye, FaHeart, FaUsers } from "react-icons/fa";

const aboutCards = [
  {
    title: "Our Mission",
    desc: "To connect readers across Bangladesh with books in Bangla and English, and to celebrate the rich literary heritage of our nation. We aim to make reading accessible and enjoyable for everyone, from Dhaka to Chittagong and beyond.",
    icon: <FaEye className="text-4xl mb-2" />,
  },
  {
    title: "Our Team",
    desc: "A passionate group of Bangladeshi readers, developers, and designers from all over the country, dedicated to making BookBazar the best place to discover, buy, and discuss books in Bangladesh.",
    icon: <FaUsers className="text-4xl mb-2" />,
  },
  {
    title: "Our Values",
    desc: "Diversity, inclusivity, and a love for Bangla literature. We celebrate the works of Rabindranath Tagore, Kazi Nazrul Islam, Humayun Ahmed, and many more, while welcoming new voices from every corner of Bangladesh.",
    icon: <FaHeart className="text-4xl mb-2" />,
  },
];

const About = ({ darkMode }) => {
  return (
    <section className={`py-20 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white' 
        : 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
    }`}>
      <div className="max-w-7xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold mb-8">About BookBazar</h1>
        <p className="mb-8 text-lg opacity-90">
          Welcome to BookBazar! We are your trusted platform for discovering, sharing, and discussing books in Bangla and English.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutCards.map((card, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-lg shadow-xl transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 text-white border border-gray-700' 
                  : 'bg-white text-black'
              }`}
            >
              <div className={darkMode ? 'text-indigo-400' : 'text-indigo-600'}>
                {card.icon}
              </div>
              <h2 className="text-xl font-bold mt-4">{card.title}</h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;