/*global kakao*/
import { useEffect, useState } from 'react'
import './tab.css'
import React from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreData } from './store/modules/getStoreData'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import Table from './Table'
import markerImg from './img/marker_yju.png'
function Main() {
  const [visible, setVisible] = useState(true)
  const [typeValue, setType] = useState('gm')
  const [storeList, setStoreList] = useState(null)
  const stores = useSelector(state => state.Reducers.stores)
  const loading = useSelector(state => state.Reducers.store_pending)
  const dispatch = useDispatch()
  const [info, setInfo] = useState()
  const [markers, setMarkers] = useState([])
  const [map, setMap] = useState()

  useEffect(() => {
    dispatch(getStoreData(typeValue))
    console.log('실행됬어 ㅋ')
  }, [])
  useEffect(() => {
    if (!map) return
    const ps = new kakao.maps.services.Places()

    ps.keywordSearch('영진전문대 글로벌캠퍼스', (data, status, _pagination) => {
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
            address_name: data[i].address_name,
            place_url: data[i].place_url,
          })
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
        }
        setMarkers(markers)

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds)
      }
    })
  }, [map])

  const mapSearch = object => {
    if (!map) return
    const ps = new kakao.maps.services.Places()
    console.log(object)
    ps.keywordSearch(
      object.original.지역1 + object.original.가게명,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          const bounds = new kakao.maps.LatLngBounds()
          let markers = []

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
              address_name: data[i].address_name,
              place_url: data[i].place_url,
            })
            // @ts-ignore
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
          }
          setMarkers(markers)

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds)
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
              <Table columns={columns} data={data} mapSearch={mapSearch} />
            ) : (
              <h1>없음</h1>
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
                  onClick={() => setInfo(marker)}
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
                  {info && info.content === marker.content && (
                    <div class=" w-96 bg-base-100 shadow-xl">
                      <figure>
                        <img
                          src="https://placeimg.com/400/225/arch"
                          alt="Shoes"
                        />
                      </figure>
                      <div class="card-body">
                        <h2 class="card-title">{marker.content}</h2>
                        <h3 class="card-title">{marker.address_name}</h3>
                        <p>{marker.phone}</p>
                        <div class="card-actions justify-end">
                          <button class="btn ">카카오맵에서 보기</button>
                        </div>
                      </div>
                    </div>
                  )}
                </MapMarker>
              </>
            ))}
          </Map>
        </div>
        <div>
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
        </div>
      </div>
    </div>
  )
}

export default Main
