import TweetList from "../components/tweet-list";

export default function Search() {
  return (
    <div>
      <div>
        <form>
          <input></input>
        </form>
      </div>
      <div className="flex flex-col gap-5">
        {tweets.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet.id} className="p-4 border rounded">
              <p>{tweet.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
