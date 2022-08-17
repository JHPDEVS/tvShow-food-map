import { useEffect, useState } from 'react'
import './tab.css'
import React from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreData } from './store/modules/getStoreData'
import { Map } from 'react-kakao-maps-sdk'
import Table from './Table'
function Main() {
  const [visible, setVisible] = useState(true)
  const [typeValue, setType] = useState('gm')
  const stores = useSelector(state => state.Reducers.stores)
  const loading = useSelector(state => state.Reducers.store_pending)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getStoreData(typeValue))
    console.log('실행됬어 ㅋ')
  }, [])
  const columns = React.useMemo(
    () => [
      {
        Header: '지역',
        accessor: '지역1',
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
          <div className="h-full">
            <ul class="overflow-auto">
              <div class="min-w-full overflow-y-auto bg-white card mx-auto">
                <div class="wrapper">
                  <input
                    type="radio"
                    name="select"
                    id="option-1"
                    value="recipe"
                  />
                  <input
                    type="radio"
                    name="select"
                    id="option-2"
                    value="food"
                  />
                  <input
                    type="radio"
                    name="select"
                    id="option-3"
                    value="vard"
                  />
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
            {stores != null ? (
              <Table columns={columns} data={data} />
            ) : (
              <h1>없음</h1>
            )}
          </div>
        </div>
        <div class="col-span-2 h-screen w-full">
          <Map // 지도를 표시할 Container
            center={{
              // 지도의 중심좌표
              lat: 33.450701,
              lng: 126.570667,
            }}
            style={{
              // 지도의 크기
              width: '100%',
              height: '100%',
            }}
            level={3} // 지도의 확대 레벨
          />
        </div>
      </div>
    </div>
  )
}

export default Main
