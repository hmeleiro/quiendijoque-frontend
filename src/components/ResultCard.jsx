function ResultCard(props) {
  const { result } = props
  const headline = result.headline
  const source = 'El País'
  const url = result.url
  const date = new Date(result.date)
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  console.log(result)

  return (
    <div className="bg-slate-200 mb-5 p-7 rounded-lg text-left shadow-xl">
      <p className="text-xl font-bold">
        {' '}
        <a href={url} target="_blank">
          {headline}
        </a>{' '}
      </p>
      <p className="font-light">
        <span>{source}</span> <span>({formattedDate})</span>{' '}
      </p>

      {result.sentences.map((sentence, i) => {
        const entities_text = sentence.entities.map((entity, i) => {
          return (
            <span
              key={i}
              className="bg-red-500 text-white mr-2 pt-1 pb-1 pl-2 pr-2 rounded-md"
            >
              {' '}
              {entity[0]}{' '}
            </span>
          )
        })

        return (
          <div key={i} className="pl-8 p-2 rounded-lg text-left">
            <p className="mb-3">{sentence.text}</p>
            <p className="mb-3">{entities_text} </p>
          </div>
        )
      })}
    </div>
  )
}

export default ResultCard
