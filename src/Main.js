/*global kakao*/

import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getStoreData } from "./store/modules/getStoreData";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Table from "./Table";
import markerImg from "./img/marker_yju.png";
import YouTube from "react-youtube";
import { Menu, X } from "lucide-react";

function Main() {
  // 表示状態の管理
  const [visible, setVisible] = useState(true);
  // レストランタイプの初期値
  const [typeValue, setType] = useState("골목식당");
  // 店舗リストの状態管理
  const [storeList, setStoreList] = useState([]);
  // 評価追加モーダルの開閉状態
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  // 評価確認モーダルの開閉状態
  const [ratingCheckOpen, setRatingCheckOpen] = useState(false);
  // 評価編集モーダルの開閉状態
  const [ratingEditOpen, setRatingEditOpen] = useState(false);
  // モバイル用サイドバー表示状態
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Reduxから店舗データを取得
  const stores = useSelector((state) => state.Reducers.stores);
  // ローディング状態の取得
  const loading = useSelector((state) => state.Reducers.store_pending);
  // Reduxのディスパッチ関数
  const dispatch = useDispatch();

  // 選択されたマーカーの情報
  const [info, setInfo] = useState();
  // 評価データの配列
  const [rates, setRates] = useState([]);
  // 地図上のマーカー配列
  const [markers, setMarkers] = useState([]);
  // 地図インスタンス
  const [map, setMap] = useState();
  // YouTube動画のURL
  const [youtubeURL, setYoutubeURL] = useState("null");
  // 評価の総数
  const [count, setCount] = useState(0);
  // 評価の合計点
  const [sum, setSum] = useState(0);
  // 現在編集中の評価データ
  const [currentEditRate, setCurrentEditRate] = useState(null);

  useEffect(() => {
    console.log(currentEditRate);
  }, [currentEditRate]);
  // 新しい評価のフォームデータ
  const [newRating, setNewRating] = useState({
    rating: 5,
    comment: "",
    author: "",
  });

  useEffect(() => {
    console.log(markers);
  }, [markers]);
  // 評価追加モーダルを開く
  const handleRatingModalOpen = () => {
    setRatingModalOpen(true);
    console.log("評価モーダルを開く");
  };

  // 評価編集モーダルを開く
  const handleRatingEditOpen = (rate) => {
    setCurrentEditRate(rate);
    setRatingEditOpen(true);
    console.log("編集モーダルを開く");
  };

  // 各モーダルを閉じる関数
  const handleRatingModalClose = () => {
    setRatingModalOpen(false);
    setNewRating({ rating: 5, comment: "", author: "" });
  };
  const handleRatingCheckClose = () => setRatingCheckOpen(false);
  const handleRatingEditClose = () => setRatingEditOpen(false);

  // コンポーネント初期化時に店舗データを取得
  useEffect(() => {
    dispatch(getStoreData(typeValue));
    console.log("初期データ取得実行");
  }, []);

  // YouTube URL変更時のログ出力
  useEffect(() => {
    console.log("YouTube URLが変更されました");
  }, [youtubeURL]);

  // 評価データ変更時のログ出力
  useEffect(() => {
    console.log("評価データが変更されました");
  }, [rates]);

  // 地図が作成された後にキーワード検索を実行
  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    // "치꼬"キーワードで場所検索
    ps.keywordSearch("치꼬", (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        const markers = [];
        setStoreList(data);

        // 検索結果をマーカーデータに変換
        for (var i = 0; i < data.length; i++) {
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
          });
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        setMarkers(markers);
        console.log("検索結果:", data);
        map.setBounds(bounds);
      }
    });
  }, [map]);

  const handleEditRate = (value, info) => {
    console.log(currentEditRate);
    console.log(value, info);
    axios
      .put(
        `https://jhpdev.xyz/proxy/https://json.jhpdev.xyz/rate/${currentEditRate.id}`,
        {
          address_id: info.address_id,
          value: value.value,
          password: info.password,
          nickname: "匿名の男",
          name: info.content,
          comment: value.comment,
        }
      )
      .then((res) => {
        getRateByName(info.content);
        handleRatingEditClose();
      })
      .catch((err) => {
        alert(err);
      });
  };

  // YouTube動画検索機能
  const youtubeSearch = (keyword) => {
    let url = null;
    axios
      .get(`https://dapi.kakao.com/v2/search/vclip?query=${keyword}`, {
        headers: {
          Authorization: "KakaoAK 6d232aab94f1bc2bbd01415879582f28",
        },
      })
      .then((res) => {
        if (res.data.documents[0]) {
          url = res.data.documents[0].url;
          const youtubeId = url.substring(31, url.length);
          setYoutubeURL(youtubeId);
        } else {
          setYoutubeURL(null);
        }
        console.log("YouTube検索キーワード:", keyword);
      });
  };

  // 店舗名で評価データを取得
  const getRateByName = (name) => {
    console.log(name);
    axios
      .get(`https://jhpdev.xyz/proxy/https://json.jhpdev.xyz/rate?name=${name}`)
      .then((res) => {
        console.log("名前による評価データ:", res.data);
        let sum = 0;
        res.data.map((rate) => {
          sum += rate.value;
        });
        setRates(res.data);
        setSum(sum);
        setCount(res.data.length);
      });
  };

  // テーブルから選択された店舗を地図で検索
  const mapSearch = (object) => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(
      object.original.지역1 + object.original.가게명,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          const bounds = new kakao.maps.LatLngBounds();
          const markers = [];
          setStoreList(data);

          for (var i = 0; i < data.length; i++) {
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
            });
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          setMarkers(markers);
          map.setBounds(bounds);
          // モバイル에서 검색 후 사이드바 닫기
          if (window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert("検索結果が存在しません。");
          return;
        } else if (status === kakao.maps.services.Status.ERROR) {
          alert("検索中にエラーが発生しました。");
          return;
        }
        console.log("地図検索が実行されました");
      }
    );
  };

  // 評価を送信する関数
  const submitRating = async (newRating, info) => {
    console.log(newRating, info);
    axios
      .post("https://jhpdev.xyz/proxy/https://json.jhpdev.xyz/rate", {
        address_id: info.address_id,
        name: info.content,
        value: newRating.rating,
        password: 5,
        nickname: newRating.name,
        comment: newRating.comment,
      })
      .then((res) => {
        getRateByName(info.content);
        setRatingModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  // 星評価コンポーネント
  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              readonly ? "" : "cursor-pointer"
            } transition-colors ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
    );
  };

  // テーブルのカラム定義
  const columns = React.useMemo(
    () => [
      {
        Header: "地域",
        accessor: "지역1_jp",
      },
      {
        Header: "ゴルク",
        accessor: "골목_jp",
      },
      {
        Header: "店舗名",
        accessor: "가게명_jp",
      },
      {
        Header: "メニュー",
        accessor: "메뉴_jp",
      },
    ],
    []
  );

  // テーブルデータのメモ化
  const data = React.useMemo(() => stores, [stores]);

  useEffect(() => {
    console.log("店舗データが変更されました");
    console.log(stores);
  }, [stores]);

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {/* モバイル用ヘッダー */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">店舗検索</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="flex h-full lg:h-screen">
        {/* サイドバー（テーブル部分） */}
        <div
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
          fixed inset-y-0 left-0 z-50 w-full sm:w-80 lg:w-1/3
          bg-white border-r border-gray-300
          transform transition-transform duration-300 ease-in-out
          flex flex-col
        `}
        >
          {/* モバイル用オーバーレイ */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex-1 overflow-hidden relative z-50">
            {stores != null ? (
              <Table
                columns={columns}
                data={data}
                mapSearch={mapSearch}
                getRate={getRateByName}
                onRowClick={(rate) => getRateByName}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <h1 className="text-gray-500">データがありません</h1>
              </div>
            )}
          </div>
        </div>

        {/* 地図部分 */}
        <div className="flex-1 relative">
          <Map
            center={{
              lat: 35.9690372,
              lng: 128.4520289,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
            level={3}
            onCreate={setMap}
          >
            {markers.map((marker) => (
              <MapMarker
                key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                onClick={() => {
                  setInfo(marker);
                  getRateByName(marker.content);
                }}
                image={{
                  src: markerImg,
                  size: {
                    width: 64,
                    height: 69,
                  },
                  options: {
                    offset: {
                      x: 27,
                      y: 69,
                    },
                  },
                }}
              >
                {info && info.address_id === marker.address_id && (
                  <div className="w-80 sm:w-96 bg-white rounded border-4 shadow-2xl overflow-hidden relative max-h-[80vh] overflow-y-auto">
                    <button
                      onClick={() => setInfo(null)}
                      className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500 hover:text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    {/* YouTube動画表示部分 */}
                    {youtubeURL && youtubeURL !== "null" && (
                      <div className="w-full">
                        <YouTube
                          videoId={youtubeURL}
                          opts={{
                            width: "100%",
                            height: "180",
                            playerVars: {
                              autoplay: 0,
                              rel: 0,
                              modestbranding: 1,
                            },
                          }}
                          onEnd={(e) => {
                            e.target.stopVideo(0);
                          }}
                        />
                      </div>
                    )}
                    {youtubeSearch(`${typeValue} ${marker.content} `)}

                    <div className="p-4 sm:p-6">
                      {/* 店舗名とアイコン */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-full">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 pr-8 leading-tight">
                          {marker.content}
                        </h3>
                      </div>

                      {/* 評価表示部分 */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-4 p-3 bg-yellow-50 rounded-lg">
                        <StarRating
                          rating={count > 0 ? Math.round(sum / count) : 0}
                          readonly={true}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-bold text-gray-900">
                            {count > 0 ? (sum / count).toFixed(1) : "未評価"}
                          </span>
                          <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                            {count}件
                          </span>
                        </div>
                      </div>

                      {/* カテゴリ表示 */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {marker.category_name.split(">").pop()}
                        </span>
                      </div>

                      {/* 住所と電話番号 */}
                      <div className="space-y-3 mb-6 text-sm text-gray-600">
                        <div className="flex items-start gap-3">
                          <svg
                            className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          <span className="leading-relaxed break-words">
                            {marker.address_name}
                          </span>
                        </div>
                        {marker.phone && (
                          <div className="flex items-center gap-3">
                            <svg
                              className="w-4 h-4 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>{marker.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* アクションボタン */}
                      <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <button
                          onClick={handleRatingModalOpen}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                        >
                          評価を付ける
                        </button>
                        <button
                          onClick={() => setRatingCheckOpen(true)}
                          className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-gray-50 text-sm sm:text-base"
                        >
                          評価を確認
                        </button>
                      </div>

                      {/* カカオマップリンク */}
                      <a
                        href={marker.place_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        カカオマップで見る
                      </a>
                    </div>
                  </div>
                )}
              </MapMarker>
            ))}
          </Map>
        </div>

        {/* 評価追加モーダル */}
        {ratingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                {/* モーダルヘッダー */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    評価を追加
                  </h2>
                  <button
                    onClick={handleRatingModalClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* フォーム内容 */}
                <div className="space-y-6">
                  {/* 評価選択 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      評価 (1-5)
                    </label>
                    <div className="flex justify-center">
                      <StarRating
                        rating={newRating.rating}
                        onRatingChange={(rating) =>
                          setNewRating({ ...newRating, rating })
                        }
                      />
                    </div>
                  </div>

                  {/* コメント入力 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      コメント
                    </label>
                    <textarea
                      value={newRating.comment}
                      onChange={(e) =>
                        setNewRating({ ...newRating, comment: e.target.value })
                      }
                      placeholder="お店の感想をお聞かせください"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                    />
                  </div>

                  {/* ボタン */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => submitRating(newRating, info)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                    >
                      評価を送信
                    </button>
                    <button
                      onClick={handleRatingModalClose}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 評価確認モーダル */}
        {ratingCheckOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                {/* モーダルヘッダー */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    評価一覧
                  </h2>
                  <button
                    onClick={handleRatingCheckClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* 評価リスト */}
                <div className="space-y-4">
                  {rates.length > 0 ? (
                    rates.map((rate, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
                          <div className="flex items-center gap-3">
                            <StarRating rating={rate.value} readonly={true} />
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              {rate.author || "匿名"}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRatingEditOpen(rate)}
                            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors self-start"
                          >
                            編集
                          </button>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                          {rate.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">
                        まだ評価がありません
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        最初の評価を追加してみませんか？
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 評価編集モーダル */}
        {ratingEditOpen && currentEditRate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                {/* モーダルヘッダー */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    評価を編集
                  </h2>
                  <button
                    onClick={handleRatingEditClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* 編集フォーム */}
                <div className="space-y-6">
                  {/* 評価表示 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      現在の評価
                    </label>
                    <div className="flex justify-center">
                      <StarRating
                        rating={currentEditRate.value}
                        onRatingChange={(value) =>
                          setCurrentEditRate({ ...currentEditRate, value })
                        }
                      />
                    </div>
                  </div>

                  {/* コメント編集 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      コメント
                    </label>
                    <textarea
                      defaultValue={currentEditRate.comment || ""}
                      placeholder="コメントを編集してください"
                      rows={4}
                      onChange={(e) =>
                        setCurrentEditRate({
                          ...currentEditRate,
                          comment: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                    />
                  </div>

                  {/* ボタン */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                      onClick={() => handleEditRate(currentEditRate, info)}
                    >
                      更新
                    </button>
                    <button
                      onClick={handleRatingEditClose}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
