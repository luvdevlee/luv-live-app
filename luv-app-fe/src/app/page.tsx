export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="content-backdrop p-12 mb-8">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Luv Live Stream
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Professional live streaming platform với background động đẹp mắt và hiện đại
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="btn-gradient text-lg px-8 py-3">
                Bắt đầu Stream
              </button>
              <button className="px-8 py-3 text-lg rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tính năng nổi bật
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "HD Streaming",
                desc: "Chất lượng video cao với độ trễ thấp",
                icon: "🎥"
              },
              {
                title: "Interactive Chat", 
                desc: "Tương tác trực tiếp với người xem",
                icon: "💬"
              },
              {
                title: "Analytics",
                desc: "Theo dõi thống kê và hiệu suất",
                icon: "📊"
              }
            ].map((feature, index) => (
              <div key={index} className="content-backdrop p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
