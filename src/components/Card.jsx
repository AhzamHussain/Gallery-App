const Card = ({ elem }) => {
  return (
    <div>
      <a href={elem.url} target='_blank' rel='noopener noreferrer'>
        <div className='h-40 w-44 overflow-hidden rounded-xl'>
          <img
            className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
            src={elem.download_url}
            alt={`Photo by ${elem.author}`}
            loading='lazy'
          />
        </div>
        <h2 className='font-bold text-lg w-44 truncate' title={elem.author}>
          {elem.author}
        </h2>
      </a>
    </div>
  )
}

export default Card