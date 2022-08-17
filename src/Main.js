import { useEffect, useState } from 'react'
import './tab.css'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreData } from './store/modules/getStoreData'
import { Map } from 'react-kakao-maps-sdk'
function Main() {
  const [miseList, setMiseList] = useState(null)
  const [visible, setVisible] = useState(true)
  const [typeValue, setType] = useState('gm')
  const stores = useSelector(state => state.Reducers.stores)
  const loading = useSelector(state => state.Reducers.store_pending)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getStoreData(typeValue))
    console.log('실행됬어 ㅋ')
  }, [])

  useEffect(() => {
    console.log('값 바뀜')
    console.log(miseList)
  }, [miseList])
  return (
    <div class=" mx-auto h-screen overflow-hidden">
      <div class="min-w-full border rounded lg:grid lg:grid-cols-3">
        <div class="border-r border-gray-300 lg:col-span-1">
          <div class="mx-3 mt-3">
            <div class="relative text-gray-600">
              <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  class="w-6 h-6 text-gray-300"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                type="search"
                className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
                name="search"
                placeholder="검색"
                required
              />
            </div>
          </div>

          <ul class="overflow-auto">
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
          <div class="overflow-y-auto h-[calc(80vh)] overflow-x-hidden">
            <table class="w-full table-fixed text-sm text-center text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                  <th scope="col" class="px-6 py-4 rounded-l-lg">
                    지역
                  </th>
                  <th scope="col" class="">
                    가게명
                  </th>
                  <th scope="col" class="rounded-r-lg">
                    메뉴
                  </th>
                </tr>
              </thead>
              <tbody>
                {stores && !loading && typeValue == 'gm'
                  ? stores.map((store, index) => (
                      <tr class="bg-white dark:bg-gray-800">
                        <td className="px-6 py-4 rounded-l-lg">
                          {store.지역1}
                        </td>
                        <td className="font-bold">{store.가게명}</td>
                        <td className="overflow-hidden text-ellipsis rounded-r-lg">
                          {store.메뉴}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
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
