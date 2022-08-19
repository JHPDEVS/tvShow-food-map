import { useState, Fragment, useEffect } from 'react'
import * as React from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import { Rating } from '@mui/material'
function RatingEditModal(props) {
  const [comment, setComment] = useState()
  const [ratingValue, setRatingValue] = useState()
  const editRate = () => {
    axios
      .put(`https://api.ckme.live/rate/${props.value.id}`, {
        address_id: props.value.address_id,
        value: ratingValue,
        password: props.value.password,
        nickname: '익명의 사나이',
        name: props.value.content,
        comment: comment,
      })
      .then(res => {
        alert('수정성공')
        props.getRate(props.value.address_id)
        props.handleClose()
      })
      .catch(err => {
        alert(err)
      })
  }

  useEffect(() => {
    return () => {
      setComment(props.value.comment)
      setRatingValue(props.value.value)
    }
  }, [])

  useEffect(() => {
    return () => {
      console.log('updated')
    }
  }, [comment, ratingValue])
  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={props.handleClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl shadow border dark:bg-gray-900">
              <div className="flex justify-end ">
                <button
                  type="button"
                  onClick={props.handleClose}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-toggle="authentication-modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="mx-auto">
                <div className="font-bold text-xl p-2 oveflow-x-auto">
                  별점 수정하기
                </div>
                <div className="flex flex-col overflow-y-auto h-96 px-2">
                  <article>
                    <div class="flex items-center mb-1">
                      <Rating
                        name="simple-controlled"
                        value={ratingValue}
                        onChange={(event, newValue) => {
                          setRatingValue(newValue)
                        }}
                      />
                      <h3 class="ml-2 text-sm font-semibold text-gray-900 dark:text-white">
                        {ratingValue}개
                      </h3>
                    </div>

                    <div class="py-2 px-4 bg-gray rounded-b-lg dark:bg-gray-800">
                      <label for="editor" class="sr-only">
                        Publish post
                      </label>
                      <textarea
                        id="editor"
                        rows="8"
                        class="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                        placeholder="코멘트를 입력해주세요"
                        required
                        value={comment}
                        onChange={event => {
                          setComment(event.target.value)
                        }}
                      ></textarea>
                    </div>
                  </article>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <button
                  onClick={() => editRate()}
                  className=" px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  수정하기
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
export default RatingEditModal
