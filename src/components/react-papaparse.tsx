'use client'

import { CSSProperties, useState } from 'react'

import {
  formatFileSize,
  lightenDarkenColor,
  useCSVReader,
} from 'react-papaparse'

const GREY = '#CCC'
const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)'
const DEFAULT_REMOVE_HOVER_COLOR = '#A01919'
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
)
const GREY_DIM = '#686868'

const styles = {
  zone: {
    alignItems: 'center',
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    padding: 20,
  } as CSSProperties,
  file: {
    background: 'linear-gradient(to bottom, #EEE, #DDD)',
    borderRadius: 20,
    display: 'flex',
    height: 120,
    width: 120,
    position: 'relative',
    zIndex: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  } as CSSProperties,
  info: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: '0.5em',
    justifyContent: 'center',
    display: 'flex',
  } as CSSProperties,
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: '0.5em',
  } as CSSProperties,
  progressBar: {
    bottom: 14,
    position: 'absolute',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  zoneHover: {
    borderColor: GREY_DIM,
  } as CSSProperties,
  default: {
    borderColor: GREY,
  } as CSSProperties,
  remove: {
    height: 23,
    position: 'absolute',
    right: 6,
    top: 6,
    width: 23,
  } as CSSProperties,
}

export default function CSVReader() {
  const { CSVReader } = useCSVReader()
  const [zoneHover, setZoneHover] = useState(false)
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  )

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        console.log('---------------------------')
        console.log(results)
        console.log('---------------------------')
        setZoneHover(false)
      }}
      onDragOver={(event: DragEvent) => {
        event.preventDefault()
        setZoneHover(true)
      }}
      onDragLeave={(event: DragEvent) => {
        event.preventDefault()
        setZoneHover(false)
      }}
      config={{ header: true }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }: any) => (
        <>
          <div
            {...getRootProps()}
            style={Object.assign(
              {},
              styles.zone,
              zoneHover && styles.zoneHover
            )}
          >
            {acceptedFile ? (
              <>
                <div style={styles.file}>
                  <div style={styles.info}>
                    <span style={styles.size}>
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <span style={styles.name}>{acceptedFile.name}</span>
                  </div>
                  <div style={styles.progressBar}>
                    <ProgressBar />
                  </div>
                  <div
                    {...getRemoveFileProps()}
                    style={styles.remove}
                    onMouseOver={(event: Event) => {
                      event.preventDefault()
                      setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT)
                    }}
                    onMouseOut={(event: Event) => {
                      event.preventDefault()
                      setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR)
                    }}
                  >
                    <Remove color={removeHoverColor} />
                  </div>
                </div>
              </>
            ) : (
              'Drop CSV file here or click to upload'
            )}
          </div>
        </>
      )}
    </CSVReader>
  )
}

// const testData = [
//     {
//         "Book Id": "77074",
//         "Title": "What's the Matter with Kansas? How Conservatives Won the Heart of America",
//         "Author": "Thomas  Frank",
//         "Author l-f": "Frank, Thomas",
//         "Additional Authors": "",
//         "ISBN": "=\"0805073396\"",
//         "ISBN13": "=\"9780805073393\"",
//         "My Rating": "0",
//         "Average Rating": "3.84",
//         "Publisher": "Metropolitan Books",
//         "Binding": "Hardcover",
//         "Number of Pages": "306",
//         "Year Published": "2004",
//         "Original Publication Year": "2004",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     },
//     {
//         "Book Id": "60114",
//         "Title": "Understanding Comics",
//         "Author": "Scott McCloud",
//         "Author l-f": "McCloud, Scott",
//         "Additional Authors": "",
//         "ISBN": "=\"1563895579\"",
//         "ISBN13": "=\"9781563895579\"",
//         "My Rating": "0",
//         "Average Rating": "4.01",
//         "Publisher": "Dc Comics",
//         "Binding": "Paperback",
//         "Number of Pages": "215",
//         "Year Published": "1999",
//         "Original Publication Year": "1993",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     },
//     {
//         "Book Id": "34451",
//         "Title": "Eat to Live: The Revolutionary Formula for Fast and Sustained Weight Loss",
//         "Author": "Joel Fuhrman",
//         "Author l-f": "Fuhrman, Joel",
//         "Additional Authors": "",
//         "ISBN": "=\"0316735507\"",
//         "ISBN13": "=\"9780316735506\"",
//         "My Rating": "0",
//         "Average Rating": "4.13",
//         "Publisher": "Little, Brown and Company",
//         "Binding": "Paperback",
//         "Number of Pages": "292",
//         "Year Published": "2005",
//         "Original Publication Year": "2003",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     },
//     {
//         "Book Id": "18276352",
//         "Title": "But How Do It Know? The Basic Principles of Computers for Everyone",
//         "Author": "J. Clark Scott",
//         "Author l-f": "Scott, J. Clark",
//         "Additional Authors": "",
//         "ISBN": "=\"0615303765\"",
//         "ISBN13": "=\"9780615303765\"",
//         "My Rating": "0",
//         "Average Rating": "4.47",
//         "Publisher": "John C. Scott",
//         "Binding": "Paperback",
//         "Number of Pages": "221",
//         "Year Published": "2009",
//         "Original Publication Year": "2009",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     },
//     {
//         "Book Id": "18259857",
//         "Title": "It's Just A F***Ing Date: Some Sort of Book about Dating",
//         "Author": "Greg Behrendt",
//         "Author l-f": "Behrendt, Greg",
//         "Additional Authors": "Amiira Ruotola",
//         "ISBN": "=\"1626811202\"",
//         "ISBN13": "=\"9781626811201\"",
//         "My Rating": "0",
//         "Average Rating": "3.77",
//         "Publisher": "Diversion Books",
//         "Binding": "Paperback",
//         "Number of Pages": "224",
//         "Year Published": "2013",
//         "Original Publication Year": "2007",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     },
//     {
//         "Book Id": "11047925",
//         "Title": "Moby Dick: or, the White Whale",
//         "Author": "Herman Melville",
//         "Author l-f": "Melville, Herman",
//         "Additional Authors": "",
//         "ISBN": "=\"\"",
//         "ISBN13": "=\"\"",
//         "My Rating": "0",
//         "Average Rating": "3.56",
//         "Publisher": "",
//         "Binding": "Kindle Edition",
//         "Number of Pages": "549",
//         "Year Published": "2011",
//         "Original Publication Year": "1851",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     },
//     {
//         "Book Id": "58095605",
//         "Title": "The Buried Giant",
//         "Author": "Kazuo Ishiguro",
//         "Author l-f": "Ishiguro, Kazuo",
//         "Additional Authors": "",
//         "ISBN": "=\"\"",
//         "ISBN13": "=\"\"",
//         "My Rating": "0",
//         "Average Rating": "3.58",
//         "Publisher": "Vintage",
//         "Binding": "Kindle Edition",
//         "Number of Pages": "317",
//         "Year Published": "2015",
//         "Original Publication Year": "2015",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     },
//     {
//         "Book Id": "24204222",
//         "Title": "The Drama of the Gifted Child: The Search for the True Self",
//         "Author": "Alice   Miller",
//         "Author l-f": "Miller, Alice",
//         "Additional Authors": "",
//         "ISBN": "=\"\"",
//         "ISBN13": "=\"\"",
//         "My Rating": "0",
//         "Average Rating": "4.05",
//         "Publisher": "Basic Books",
//         "Binding": "Kindle Edition",
//         "Number of Pages": "133",
//         "Year Published": "2008",
//         "Original Publication Year": "1979",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     },
//     {
//         "Book Id": "23362912",
//         "Title": "The Washington Irving Anthology: The Complete Fiction and Collected Non-Fiction Works",
//         "Author": "Washington Irving",
//         "Author l-f": "Irving, Washington",
//         "Additional Authors": "",
//         "ISBN": "=\"\"",
//         "ISBN13": "=\"\"",
//         "My Rating": "0",
//         "Average Rating": "4.29",
//         "Publisher": "Bybliotech",
//         "Binding": "Kindle Edition",
//         "Number of Pages": "3933",
//         "Year Published": "2014",
//         "Original Publication Year": "2014",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     },
//     {
//         "Book Id": "18869252",
//         "Title": "The Party Is Over: How Republicans Went Crazy, Democrats Became Useless, and the Middle Class Got Shafted",
//         "Author": "Mike Lofgren",
//         "Author l-f": "Lofgren, Mike",
//         "Additional Authors": "",
//         "ISBN": "=\"110160123X\"",
//         "ISBN13": "=\"9781101601235\"",
//         "My Rating": "0",
//         "Average Rating": "3.95",
//         "Publisher": "Penguin Books",
//         "Binding": "Kindle Edition",
//         "Number of Pages": "238",
//         "Year Published": "2012",
//         "Original Publication Year": "2012",
//         "Date Read": "",
//         "Date Added": "2025/03/26",
//         "Bookshelves": "",
//         "Bookshelves with positions": "",
//         "Exclusive Shelf": "read",
//         "My Review": "",
//         "Spoiler": "",
//         "Private Notes": "",
//         "Read Count": "1",
//         "Owned Copies": "0"
//     }
// ]
