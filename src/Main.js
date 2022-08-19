/*global kakao*/
import { useEffect, useState } from 'react'
import './tab.css'
import './input.css'
import React from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreData } from './store/modules/getStoreData'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import Table from './Table'
import { CogIcon } from '@heroicons/react/solid'
import markerImg from './img/marker_yju.png'
import YouTube from 'react-youtube'
import RatingModal from './RatingModal'
import RatingCheck from './RatingCheck'
import RatingEditModal from './RatingEditModal'
function Main() {
  const [visible, setVisible] = useState(true)
  const [typeValue, setType] = useState('골목식당')
  const [storeList, setStoreList] = useState([])
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const stores = useSelector(state => state.Reducers.stores)
  const loading = useSelector(state => state.Reducers.store_pending)
  const dispatch = useDispatch()
  const [info, setInfo] = useState()
  const [rates, setRates] = useState([])
  const [markers, setMarkers] = useState([])
  const [map, setMap] = useState()
  const [youtubeURL, setYoutubeURL] = useState('null')
  const [count, setCount] = useState(0)
  const [sum, setSum] = useState(0)
  const [currentEditRate, setCurrentEditRate] = useState(null)
  const handleOpen = () => {
    setOpen(true)
    console.log('열기')
  }
  const handleOpen3 = rate => {
    setCurrentEditRate(rate)
    setOpen3(true)
    console.log('열기')
  }
  const handleClose = e => {
    setOpen(false)
  }
  const handleClose2 = e => {
    setOpen2(false)
  }
  const handleClose3 = e => {
    setOpen3(false)
  }
  useEffect(() => {
    dispatch(getStoreData(typeValue))
    console.log('실행됬어 ㅋ')
  }, [])

  useEffect(() => {
    console.log('바뀜')
  }, [youtubeURL])

  useEffect(() => {
    console.log('바뀜2')
  }, [rates])
  // useEffect(() => {
  //   console.log('바뀜')
  // }, [rates])

  useEffect(() => {
    if (!map) return
    const ps = new kakao.maps.services.Places()

    ps.keywordSearch('치꼬', (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds()
        let markers = []
        setStoreList(data)
        for (var i = 0; i < data.length; i++) {
          // @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
            category_name: data[i].category_name,
            phone: data[i].phone,
            address_id: data[i].id,
            address_name: data[i].address_name,
            place_url: data[i].place_url,
          })
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
        }
        setMarkers(markers)
        console.log(data)
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds)
      }
    })
  }, [map])

  const youtubeSearch = keyword => {
    let url = null
    axios
      .get(`https://dapi.kakao.com/v2/search/vclip?query=${keyword}`, {
        headers: {
          Authorization: 'KakaoAK 6d232aab94f1bc2bbd01415879582f28',
        },
      })
      .then(res => {
        if (res.data.documents[0]) {
          url = res.data.documents[0].url
          let youtubeId = url.substring(31, url.length)
          setYoutubeURL(youtubeId)
        } else {
          setYoutubeURL(null)
        }
        console.log(keyword)
      })
  }

  const getRate = address_id => {
    axios
      .get(`http://localhost:3001/rate?address_id=${address_id}`)
      .then(res => {
        console.log(res.data)
        let sum = 0
        res.data.map((rate, index) => {
          sum += rate.value
        })

        setSum(sum)

        setRates(res.data)
        setCount(res.data.length)
      })
  }
  const getRateByName = name => {
    axios.get(`http://localhost:3001/rate?name=${name}`).then(res => {
      console.log(res.data)
      let sum = 0
      res.data.map((rate, index) => {
        sum += rate.value
      })
      setRates(res.data)
      setSum(sum)
      setCount(res.data.length)
    })
  }
  const mapSearch = object => {
    if (!map) return
    const ps = new kakao.maps.services.Places()
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 })
    ps.keywordSearch(
      object.original.지역1 + object.original.가게명,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          const bounds = new kakao.maps.LatLngBounds()
          let markers = []
          setStoreList(data)
          for (var i = 0; i < data.length; i++) {
            // @ts-ignore
            markers.push({
              position: {
                lat: data[i].y,
                lng: data[i].x,
              },
              content: data[i].place_name,
              category_name: data[i].category_name,
              phone: data[i].phone,
              address_id: data[i].id,
              address_name: data[i].address_name,
              place_url: data[i].place_url,
            })
            // @ts-ignore
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
          }
          setMarkers(markers)

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds)
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 존재하지 않습니다.')
          return
        } else if (status === kakao.maps.services.Status.ERROR) {
          alert('검색 결과 중 오류가 발생했습니다.')
          return
        }
        console.log('함수 실행됨')
      }
    )
  }
  const columns = React.useMemo(
    () => [
      {
        Header: '지역',
        accessor: '지역1',
      },
      {
        Header: '골목',
        accessor: '골목',
      },
      {
        Header: '가게명',
        accessor: '가게명',
      },
      {
        Header: '메뉴',
        accessor: '메뉴',
      },
    ],
    []
  )
  const data = React.useMemo(() => stores, [stores])
  useEffect(() => {
    console.log('값 바뀜')
    console.log(stores)
  }, [stores])
  return (
    <div class=" mx-auto h-screen overflow-hidden">
      <div class="min-w-full border rounded lg:grid lg:grid-cols-3">
        <div class="border-r border-gray-300 lg:col-span-1">
          <div>
            {stores != null ? (
              <>
                <Table
                  columns={columns}
                  data={data}
                  mapSearch={mapSearch}
                  getRate={getRateByName}
                />
              </>
            ) : (
              <h1 class="loading">없음</h1>
            )}
          </div>
        </div>
        <div class="col-span-2 h-screen w-full">
          <Map // 지도를 표시할 Container
            center={{
              // 지도의 중심좌표
              lat: 35.9690372,
              lng: 128.4520289,
            }}
            style={{
              // 지도의 크기
              width: '100%',
              height: '100%',
            }}
            level={3} // 지도의 확대 레벨
            onCreate={setMap}
          >
            {markers.map(marker => (
              <>
                <MapMarker
                  key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                  position={marker.position}
                  onClick={() => {
                    setInfo(marker)
                    getRate(marker.address_id)
                  }}
                  image={{
                    src: markerImg, // 마커이미지의 주소입니다
                    size: {
                      width: 64,
                      height: 69,
                    }, // 마커이미지의 크기입니다
                    options: {
                      offset: {
                        x: 27,
                        y: 69,
                      }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                    },
                  }}
                >
                  {info && info.address_id === marker.address_id && (
                    <div class=" w-96 bg-base-100 shadow-xl">
                      <figure>
                        {youtubeURL ? (
                          <YouTube
                            videoId={youtubeURL}
                            // videoId={youtubeURL}
                            //opts(옵션들): 플레이어의 크기나 다양한 플레이어 매개 변수를 사용할 수 있음.
                            //밑에서 더 설명하겠습니다.
                            opts={{
                              width: '100%',
                              height: '315',
                              playerVars: {
                                autoplay: 0, //자동재생 O
                                rel: 0, //관련 동영상 표시하지 않음 (근데 별로 쓸모 없는듯..)
                                modestbranding: 1, // 컨트롤 바에 youtube 로고를 표시하지 않음
                              },
                            }}
                            //이벤트 리스너
                            onEnd={e => {
                              e.target.stopVideo(0)
                            }}
                          />
                        ) : null}

                        {youtubeSearch(`${typeValue} ${marker.content} `)}
                        {/* {getRate(`${marker.address_id}`)} */}
                      </figure>
                      <div class="card-body">
                        <h2 class="card-title">{marker.content}</h2>
                        <div className="flex">
                          <div class="flex items-center">
                            <svg
                              aria-hidden="true"
                              class="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Rating star</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <p class="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                              {(sum / count).toFixed(2)}
                            </p>
                            <span class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                            <a
                              href="#"
                              class="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white"
                            >
                              {count}명
                            </a>
                          </div>
                        </div>
                        <div className="w-full flex">
                          <button
                            onClick={() => handleOpen()}
                            className="btn text-white font-bold"
                          >
                            별점주기
                          </button>
                          <button
                            onClick={() => setOpen2(true)}
                            className="btn ml-2 text-white btn-error font-bold"
                          >
                            별점확인
                          </button>
                        </div>

                        <div class="text-sm breadcrumbs">
                          <ul>
                            <li>
                              <a>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  class="w-4 h-4 mr-2 stroke-current"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                  ></path>
                                </svg>

                                {
                                  marker.category_name.split('>')[
                                    marker.category_name.split('>').length - 1
                                  ]
                                }
                              </a>
                            </li>
                          </ul>
                        </div>
                        <p class="text-sm font-bold">{marker.address_name}</p>
                        <p>{marker.phone}</p>
                        <div class="card-actions justify-end">
                          <a
                            class="font-bold px-4 py-2 bg-transparent outline-none border-2 border-indigo-400 rounded text-indigo-500 active:scale-95 hover:bg-indigo-600 hover:text-white hover:border-transparent focus:bg-indigo-400 focus:text-white focus:border-transparent focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:bg-gray-400/80 disabled:shadow-none disabled:cursor-not-allowed transition-colors duration-200"
                            target="_blank"
                            href={marker.place_url}
                          >
                            카카오맵에서 보기
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </MapMarker>
              </>
            ))}
          </Map>
        </div>
        <RatingModal
          open={open}
          handleClose={handleClose}
          getRate={getRate}
          value={info}
        />
        <RatingCheck
          open={open2}
          openEditModal={handleOpen3}
          handleClose={handleClose2}
          rates={rates}
          value={info}
          getRate={getRate}
        />

        <RatingEditModal
          open={open3}
          handleClose={handleClose3}
          value={currentEditRate}
          getRate={getRate}
        />
        {/* <div>
          <ul class="fixed right-0 bottom-0 z-50">
            <div class="min-w-full overflow-y-auto bg-white card mx-auto">
              <div class="wrapper">
                <input
                  type="radio"
                  name="select"
                  id="option-1"
                  value="recipe"
                />
                <input type="radio" name="select" id="option-2" value="food" />
                <input type="radio" name="select" id="option-3" value="vard" />
                <label for="option-1" class="option option-1">
                  <span>골목식당</span>
                </label>
                <label for="option-2" class="option option-2">
                  <span>생활의달인</span>
                </label>
                <label for="option-3" class="option option-3 ">
                  <span>맛있는녀석들</span>
                </label>
              </div>
            </div>
          </ul>
        </div> */}
      </div>
    </div>
  )
}

export default Main
