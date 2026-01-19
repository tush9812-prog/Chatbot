import "./DefaultChat.css";

export const DefaultChat = () => {
  return (
    <div className="text-center text-gray-400 py-8 default-chat">
      <button className="button default-weather">
        {/* <img
                src={WeatherButton}
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              /> */}
        Weather
      </button>
      <button className="button default-finance">Finance</button>
      <button className="button default-news">News</button>
      <button className="button default-Sports">Sports</button>
    </div>
  );
};
