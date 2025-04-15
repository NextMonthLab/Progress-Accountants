export default function IndustriesSection() {
  const industries = [
    {
      icon: "🎬",
      title: "Film Industry",
      description: "From freelance tax setups to R&D tax credits — we've worked with independent producers, directors, and studios."
    },
    {
      icon: "🎵",
      title: "Music Industry",
      description: "Touring, royalties, self-employment, label accounting — we handle the numbers so you can stay creative."
    },
    {
      icon: "🏗️",
      title: "Construction",
      description: "We understand CIS, contractor management, and project-based finance. We've got the site and the spreadsheet covered."
    }
  ];

  return (
    <section id="industries" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            className="font-poppins font-bold text-2xl md:text-4xl mb-4"
            style={{ color: 'var(--navy)' }}
          >
            Specialists in complex industries
          </h2>
          <p style={{ color: 'var(--dark-grey)' }} className="text-lg">
            We serve a wide range of small businesses, but we have deep experience in sectors that demand more than basic bookkeeping.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="rounded-xl p-8 border hover:-translate-y-[5px] transition duration-300"
              style={{ 
                backgroundColor: 'var(--light-grey)',
                borderColor: 'var(--divider)'
              }}
            >
              <div className="text-4xl mb-4">{industry.icon}</div>
              <h3 
                className="font-poppins font-semibold text-xl mb-3"
                style={{ color: 'var(--navy)' }}
              >
                {industry.title}
              </h3>
              <p style={{ color: 'var(--dark-grey)' }}>
                {industry.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
