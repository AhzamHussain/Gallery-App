import { useEffect, useState } from 'react'
import axios from 'axios'
import Card from './components/Card'

const App = () => {
  const [userData, setUserData] = useState([])
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let isCancelled = false

    const getData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(
          `https://picsum.photos/v2/list?page=${index}&limit=12`
        )
        if (!isCancelled) {
          setUserData(response.data)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to load images. Please try again.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    getData()

    return () => {
      isCancelled = true
    }
  }, [index])

  const filteredData = userData.filter((item) =>
    item.author.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  return (
    <div className='bg-black h-screen flex flex-col align-baseline p-4 text-white'>
      {/* Top Header with Search Bar */}
      <header className='flex flex-col sm:flex-row gap-4 items-center justify-between pb-4 border-b border-zinc-800'>
        <h1 className='text-2xl font-bold text-amber-400 flex items-center gap-2'>
          📸 Image Gallery
        </h1>

        <div className='relative w-full sm:w-80'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z'
              />
            </svg>
          </span>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search images by author...'
            className='w-full bg-zinc-900 border border-zinc-700 text-white pl-9 pr-9 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder-zinc-500'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-white cursor-pointer'
              title='Clear search'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Gallery Content Area */}
      <div className='flex-1 overflow-auto relative p-4'>
        {loading ? (
          <h3 className='text-gray-300 text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold'>
            Loading...
          </h3>
        ) : error ? (
          <div className='text-red-400 text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-center'>
            <p>{error}</p>
            <button
              onClick={() => {
                setUserData([])
                setIndex((prev) => prev)
              }}
              className='mt-3 bg-amber-400 text-black px-4 py-1.5 rounded text-xs font-semibold cursor-pointer active:scale-95'
            >
              Retry
            </button>
          </div>
        ) : filteredData.length ===0 ? (
          <div className='text-zinc-400 text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-center'>
            <p className='text-base text-zinc-300 mb-1'>No images found</p>
            <p className='text-xs text-zinc-500 mb-3'>
              No author matches your search&quot;{searchQuery}&quot; on this page.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className='bg-amber-400 text-black px-3.5 py-1.5 rounded text-xs font-semibold hover:bg-amber-300 transition-colors cursor-pointer active:scale-95'
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className='flex flex-wrap gap-4 items-start justify-center sm:justify-start'>
            {filteredData.map((elem) => (
              <Card key={elem.id} elem={elem} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <footer className='flex justify-center gap-6 items-center p-3 border-t border-zinc-800'>
        <button
          disabled={index === 1}
          className='bg-amber-400 text-sm font-semibold text-black rounded px-4 py-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
          onClick={() => {
            if (index > 1) {
              setUserData([])
              setIndex((prev) => prev - 1)
            }
          }}
        >
          Prev
        </button>
        <h4 className='text-sm font-medium'>Page {index}</h4>
        <button
          className='bg-amber-400 text-sm font-semibold text-black rounded px-4 py-2 cursor-pointer active:scale-95'
          onClick={() => {
            setUserData([])
            setIndex((prev) => prev + 1)
          }}
        >
          Next
        </button>
      </footer>
    </div>
  )
}

export default App