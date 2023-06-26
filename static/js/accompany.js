console.log('accompany 연결')

import { payload, payloadParse, getAccompanyAPI, postAccompanyAPI, putAccompanyAPI, deleteAccompanyAPI } from "./api.js";

export let isEditingAccompany = false;
let isAccompaniesRendered = false;
let isApBtnRenderd = false;

//------------------------------------------------------------------------------------------조회----------------------------------------------------------------
// 동행구해요! 버튼 눌렀을 때 실행되는 함수
export function accompany(exhibition_id){
    if (isEditingAccompany) {
        alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
    } else {
        // 후기 안 보이게 하기
        const rvAllItemsOrganizer = document.querySelector(".rv-all-items-organizer")
        rvAllItemsOrganizer.style.display = "none"
        // 후기 작성 버튼 안 보이게 하기
        const showRvPosting = document.querySelector(".show-rv-posting")
        if (showRvPosting) {
            showRvPosting.style.display = "none"
        }
        
        const acAllItemsOrganizer = document.querySelector(".ac-all-items-organizer")
        if (acAllItemsOrganizer.style.display === "none") {
            acAllItemsOrganizer.style.display = "flex"
            // 후기 작성창 연 채로 동행글 보기 눌렀을 때 작성창 닫아주는 코드
            const reviewPostBox = document.getElementById("reviewPostBox")
            if (reviewPostBox) {
                reviewPostBox.parentElement.removeChild(reviewPostBox)
            }
            // 동행구하기 버튼 생성
            if (payload) {
                if (!isApBtnRenderd) {
                    const accompanyList = document.getElementById("accompanyList")
                    const accompanyPostingBtn = document.createElement("button")
                    accompanyPostingBtn.setAttribute("class", "show-ac-posting")
                    accompanyPostingBtn.setAttribute("id", "accompanyPostingBtn")
                    accompanyPostingBtn.innerText = "동행 구하기"
                    accompanyList.before(accompanyPostingBtn)
                    accompanyPostingBtn.addEventListener("click", function () {
                        accompanyPosting(exhibition_id)
                    })
                    isApBtnRenderd = true
                }
                // 사라졌던 동행구하기 작성 버튼 다시 보이게 하기
                const showAcPosting = document.querySelector(".show-ac-posting")
                showAcPosting.style.display = "block"
            }
            if (!isAccompaniesRendered) {
                getAccompanyAPI(exhibition_id).then(({ responseJson }) => {
                    const accompaniesDATA = responseJson.accompanies.results
                    console.log(accompaniesDATA)

                    const accompanyList = document.getElementById("accompanyList")

                    // 동행 구하기 목록
                    accompaniesDATA.forEach(accompany => {          
                        const grayBox = document.createElement("div")
                        grayBox.setAttribute("class", "ac-gray-box")
                        
                        const purpleBox = document.createElement("div")
                        purpleBox.setAttribute("class", "ac-purple-box")

                        const row1InPurple = document.createElement("div")
                        row1InPurple.setAttribute("class", "ac-row1-in-purple")

                        // 닉네임
                        const nicknameBox = document.createElement("div")
                        nicknameBox.setAttribute("class", "ac-nickname-box")
                        nicknameBox.innerText = accompany.nickname
                        row1InPurple.appendChild(nicknameBox)

                        // 목표 인원
                        const goalNumber = document.createElement("div")
                        goalNumber.setAttribute("class", "ac-goal-number")
                        goalNumber.innerText = "목표인원 "
                        const personnel = document.createElement("span")
                        personnel.setAttribute("id", "personnel")
                        personnel.innerText = `${accompany.personnel}명`
                        goalNumber.appendChild(personnel)
                        row1InPurple.appendChild(goalNumber)
                        
                        // 동행시간
                        const setDate = document.createElement("div")
                        setDate.setAttribute("class", "ac-set-date")
                        setDate.innerText = "동행시간 "
                        const time = document.createElement("span")
                        time.setAttribute("id", "timeView")
                        time.innerText = `${accompany.start_time.split("T")[0]} ${accompany.start_time.split("T")[1].slice(0,5)} ~ ${accompany.end_time.split("T")[0]} ${accompany.end_time.split("T")[1].slice(0,5)}`
                        setDate.appendChild(time)
                        row1InPurple.appendChild(setDate)
                        purpleBox.appendChild(row1InPurple)

                        const row2InPurple = document.createElement("div")
                        row2InPurple.setAttribute("class", "ac-row2-in-purple")

                        // 이런 분을 구합니다!
                        const accompanyContent = document.createElement("div")
                        accompanyContent.setAttribute("class", "ac-accompany-content")
                        const contentHeader = document.createElement("p")
                        contentHeader.setAttribute("class", "ac-content-header")
                        contentHeader.innerText = "이런 분을 구합니다!"
                        accompanyContent.appendChild(contentHeader)

                        const contentBody = document.createElement("p")
                        contentBody.setAttribute("id", "acContentBody")
                        contentBody.innerText = accompany.content
                        accompanyContent.appendChild(contentBody)

                        row2InPurple.appendChild(accompanyContent)
                        purpleBox.appendChild(row2InPurple)

                        const row3InPurple = document.createElement("div")
                        row3InPurple.setAttribute("class", "ac-row3-in-purple")

                        // 동행글 최종 수정일
                        const dateInfo = document.createElement("div")
                        dateInfo.setAttribute("class", "ac-date-info")
                        const span1 = document.createElement("span")
                        span1.innerText = "최종 수정일"
                        dateInfo.appendChild(span1)
                        const span2 = document.createElement("span")
                        span2.innerText = accompany.updated_at.split("T")[0]
                        dateInfo.appendChild(span2)
                        row3InPurple.appendChild(dateInfo)

                        // 동행신청, 수정, 삭제 버튼
                        const btngroup = document.createElement("div")
                        btngroup.setAttribute("class", "ac-btn-group")
                        // 동행신청 버튼
                        const accApplyBtn = document.createElement("button")
                        accApplyBtn.setAttribute("type", "button")
                        accApplyBtn.setAttribute("class", "acc-apply-btn")
                        accApplyBtn.innerText = "동행신청"
                        btngroup.appendChild(accApplyBtn)
                        if (payload) {
                            if (payloadParse.user_id == accompany.user){
                                // 수정 버튼
                                const accUpdateBtn = document.createElement("button")
                                accUpdateBtn.setAttribute("type", "button")
                                accUpdateBtn.setAttribute("class", "acc-update-btn")
                                accUpdateBtn.innerText = "수정"
                                accUpdateBtn.addEventListener("click", function () {
                                    if (isEditingAccompany) {
                                        alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
                                    } else {
                                        isEditingAccompany = true
                                        updateAccompany(grayBox, accompany)
                                    }
                                })
                                btngroup.appendChild(accUpdateBtn)

                                // 삭제 버튼
                                const accDeleteBtn = document.createElement("button")
                                accDeleteBtn.setAttribute("type", "button")
                                accDeleteBtn.setAttribute("class", "acc-delete-btn")
                                accDeleteBtn.innerText = "삭제"
                                accDeleteBtn.addEventListener("click", function () {
                                    deleteAccompany(grayBox, accompany)
                                })
                                btngroup.appendChild(accDeleteBtn)
                            }
                        }
                        row3InPurple.appendChild(btngroup)
                        purpleBox.appendChild(row3InPurple)     
                        grayBox.appendChild(purpleBox)       

                        // 동행 신청하기 댓글
                        console.log(accompany.applies)
                        if (accompany.applies) {
                            accompany.applies.forEach(apply => {
                                const applierAll = document.createElement("div")
                                applierAll.setAttribute("class", "applier-all")

                                const arrowMark = document.createElement("span")
                                arrowMark.setAttribute("class", "arrow-mark")
                                arrowMark.innerText = "↳"
                                applierAll.appendChild(arrowMark)

                                const applierPurpleBox = document.createElement("div")
                                applierPurpleBox.setAttribute("class", "applier-purple-box")

                                const applierRow1InPurple = document.createElement("div")
                                applierRow1InPurple.setAttribute("class", "applier-row1-in-purple")

                                // 동행 신청자 닉네임
                                const applierNickname = document.createElement("div")
                                applierNickname.setAttribute("class", "applier-nickname")
                                applierNickname.innerText = apply.nickname
                                applierRow1InPurple.appendChild(applierNickname)
                                applierPurpleBox.appendChild(applierRow1InPurple)

                                const applierRow2InPurple = document.createElement("div")
                                applierRow2InPurple.setAttribute("class", "applier-row2-in-purple")

                                // 저도 같이 갈래요!
                                const applierAccompanyContent = document.createElement("div")
                                applierAccompanyContent.setAttribute("class", "applier-accompany-content")

                                const applierContentHeader = document.createElement("p")
                                applierContentHeader.setAttribute("class", "applier-content-header")
                                applierContentHeader.innerText = "저도 같이 갈래요!"
                                applierAccompanyContent.appendChild(applierContentHeader)

                                const applierContent = document.createElement("p")
                                applierContent.innerText = apply.content
                                applierAccompanyContent.appendChild(applierContent)

                                applierRow2InPurple.appendChild(applierAccompanyContent)
                                applierPurpleBox.appendChild(applierRow2InPurple)

                                const applierRow3InPurple = document.createElement("div")
                                applierRow3InPurple.setAttribute("class", "applier-row3-in-purple")

                                // 신청댓글 최종 수정일
                                const applierDateInfo = document.createElement("div")
                                applierDateInfo.setAttribute("class", "applier-date-info")
                                const applierSpan1 = document.createElement("span")
                                applierSpan1.innerText = "최종 수정일"
                                applierDateInfo.appendChild(applierSpan1)
                                const applierSpan2 = document.createElement("span")
                                applierSpan2.innerText = apply.updated_at.split("T")[0]
                                applierDateInfo.appendChild(applierSpan2)
                                applierRow3InPurple.appendChild(applierDateInfo)

                                // 수정, 삭제 버튼
                                if (payload) {
                                    if (payloadParse.user_id == apply.user){
                                        // 수정 버튼
                                        const applierAccUpdateBtn = document.createElement("button")
                                        applierAccUpdateBtn.setAttribute("type", "button")
                                        applierAccUpdateBtn.setAttribute("class", "applier-acc-update-btn")
                                        applierAccUpdateBtn.innerText = "수정"
                                        applierRow3InPurple.appendChild(applierAccUpdateBtn)

                                        // 삭제 버튼
                                        const applierAccDeleteBtn = document.createElement("button")
                                        applierAccDeleteBtn.setAttribute("type", "button")
                                        applierAccDeleteBtn.setAttribute("class", "applier-acc-delete-btn")
                                        applierAccDeleteBtn.innerText = "삭제"
                                        applierRow3InPurple.appendChild(applierAccDeleteBtn)
                                    }
                                }
                                applierPurpleBox.appendChild(applierRow3InPurple)
                                applierAll.appendChild(applierPurpleBox)
                                grayBox.appendChild(applierAll)
                            })                
                        }            
                        accompanyList.appendChild(grayBox)
                    })
                })
                isAccompaniesRendered = true
            }
        } else {
            acAllItemsOrganizer.style.display = "none"
            // 동행구하기 버튼 다시 눌렀을 때 동행구하기 작성 버튼 안 보이게 하기
            const showAcPosting = document.querySelector(".show-ac-posting")
            showAcPosting.style.display = "none"
            // 동행구하기 작성창 연 채로 동행글 보기 다시 눌렀을 때 작성창 닫아주는 코드
            const accompanyPostBox = document.getElementById("accompanyPostBox")
            if (accompanyPostBox) {
                accompanyPostBox.parentElement.removeChild(accompanyPostBox)
            }      
        }
    }
}

//------------------------------------------------------------------------------------------작성----------------------------------------------------------------
// 동행 구하기 버튼 눌렀을 때 실행되는 함수
function accompanyPosting(exhibition_id){
    if (isEditingAccompany) {
        alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
    } else {
        // 동행구하기 버튼 안 보이게 하기
        const showAcPosting = document.querySelector(".show-ac-posting")
        showAcPosting.style.display = "none"

        // 동행구하기 작성창이 없을 때 렌더하기
        let accompanyPostBox = document.getElementById("accompanyPostBox")
        if (!accompanyPostBox) {
            const accompanyList = document.getElementById("accompanyList")

            const grayBox = document.createElement("form")
            grayBox.setAttribute("class", "ap-gray-box")
            grayBox.setAttribute("id", "accompanyPostBox")
            
            const purpleBox = document.createElement("div")
            purpleBox.setAttribute("class", "ap-purple-box")

            const row1InPurple = document.createElement("div")
            row1InPurple.setAttribute("class", "ap-row1-in-purple")

            // 닉네임
            const nicknameBox = document.createElement("div")
            nicknameBox.setAttribute("class", "ap-nickname")
            nicknameBox.innerText = payloadParse.nickname
            row1InPurple.appendChild(nicknameBox)

            // 목표 인원
            const goalNumber = document.createElement("div")
            goalNumber.setAttribute("class", "ap-goal-number")
            goalNumber.innerText = "목표인원"
            const personnel = document.createElement("input")
            personnel.setAttribute("type", "number")
            personnel.setAttribute("class", "ap-goal-num")
            personnel.setAttribute("id", "apPersonnel")
            goalNumber.appendChild(personnel)
            const myeong = document.createElement("span")
            myeong.innerText = "명"
            goalNumber.appendChild(myeong)
            row1InPurple.appendChild(goalNumber)
            
            // 동행시간
            const setDate = document.createElement("div")
            setDate.setAttribute("class", "ap-set-date")
            setDate.innerText = "동행시간 "
            const startTime = document.createElement("input")
            startTime.setAttribute("type", "datetime-local")
            startTime.setAttribute("id", "apStartTime")
            setDate.appendChild(startTime)
            const wave = document.createElement("span")
            wave.innerText = " ~ "
            setDate.appendChild(wave)
            const endTime = document.createElement("input")
            endTime.setAttribute("type", "datetime-local")
            endTime.setAttribute("id", "apEndTime")
            setDate.appendChild(endTime)
            row1InPurple.appendChild(setDate)
            purpleBox.appendChild(row1InPurple)

            const row2InPurple = document.createElement("div")
            row2InPurple.setAttribute("class", "ap-row2-in-purple")

            // 이런 분을 구합니다!
            const accompanyContent = document.createElement("div")
            accompanyContent.setAttribute("class", "ap-accompany-content")
            const contentHeader = document.createElement("p")
            contentHeader.setAttribute("class", "ap-content-header")
            contentHeader.innerText = "이런 분을 구합니다!"
            accompanyContent.appendChild(contentHeader)
            const accContent = document.createElement("textarea")
            accContent.setAttribute("class", "ap-acc-content")
            accContent.setAttribute("id", "apContent")
            accContent.setAttribute("placeholder", "내용을 입력하세요")
            accompanyContent.appendChild(accContent)
            row2InPurple.appendChild(accompanyContent)
            purpleBox.appendChild(row2InPurple)

            const row3InPurple = document.createElement("div")
            row3InPurple.setAttribute("class", "ap-row3-in-purple")

            // 동행구하기 입력완료 버튼
            const accPostingBtn = document.createElement("button")
            accPostingBtn.setAttribute("type", "button")
            accPostingBtn.setAttribute("class", "ap-acc-posting-btn")
            accPostingBtn.addEventListener("click", function () {
                handleAccompanyPosting(exhibition_id)
                accompany(exhibition_id)
            })
            accPostingBtn.innerText = "입력완료"
            row3InPurple.appendChild(accPostingBtn)
            purpleBox.appendChild(row3InPurple)
            grayBox.appendChild(purpleBox)
            accompanyList.prepend(grayBox)
        }
    }    
}

//--------------위에서 실행시킨 함수가 선언되는 부분--------------
// 사용자가 입력한 데이터
function accompanyInputInfo() {
    // 데이터 가져오기
    const accPersonnel = document.getElementById("apPersonnel").value
    const accStartTime = document.getElementById("apStartTime").value
    const accEndTime = document.getElementById("apEndTime").value
    const accContent = document.getElementById("apContent").value

    // API 전달용 data
    const data = new FormData()
    data.append("personnel", accPersonnel)
    data.append("start_time", accStartTime)
    data.append("end_time", accEndTime)
    data.append("content", accContent)

    return data
}

// 입력완료 버튼 시 실행되는 함수
function handleAccompanyPosting(exhibition_id) {
    postAccompanyAPI(exhibition_id, accompanyInputInfo()).then(({ response, responseJson }) => {
        if (response.status == 201) {
            addNewAccompany(responseJson.data)
            accompany(exhibition_id)
        } else {
            alert(responseJson.message)
        }
    })
}

// 방금 작성한 동행구하기 글 목록에 추가하기
function addNewAccompany(accompanyData) {
    const accompanyList = document.getElementById("accompanyList")

    const grayBox = document.createElement("div")
    grayBox.setAttribute("class", "ac-gray-box")
    
    const purpleBox = document.createElement("div")
    purpleBox.setAttribute("class", "ac-purple-box")

    const row1InPurple = document.createElement("div")
    row1InPurple.setAttribute("class", "ac-row1-in-purple")

    // 닉네임
    const nicknameBox = document.createElement("div")
    nicknameBox.setAttribute("class", "ac-nickname-box")
    nicknameBox.innerText = accompanyData.nickname
    row1InPurple.appendChild(nicknameBox)

    // 목표 인원
    const goalNumber = document.createElement("div")
    goalNumber.setAttribute("class", "ac-goal-number")
    goalNumber.innerText = "목표인원 "
    const personnel = document.createElement("span")
    personnel.setAttribute("id", "personnel")
    personnel.innerText = `${accompanyData.personnel}명`
    goalNumber.appendChild(personnel)
    row1InPurple.appendChild(goalNumber)

    // 동행시간
    const setDate = document.createElement("div")
    setDate.setAttribute("class", "ac-set-date")
    setDate.innerText = "동행시간 "
    const time = document.createElement("span")
    time.setAttribute("id", "timeView")
    time.innerText = `${accompanyData.start_time.split("T")[0]} ${accompanyData.start_time.split("T")[1].slice(0,5)} ~ ${accompanyData.end_time.split("T")[0]} ${accompanyData.end_time.split("T")[1].slice(0,5)}`
    setDate.appendChild(time)
    row1InPurple.appendChild(setDate)
    purpleBox.appendChild(row1InPurple)

    const row2InPurple = document.createElement("div")
    row2InPurple.setAttribute("class", "ac-row2-in-purple")

    // 이런 분을 구합니다!
    const accompanyContent = document.createElement("div")
    accompanyContent.setAttribute("class", "ac-accompany-content")
    const contentHeader = document.createElement("p")
    contentHeader.setAttribute("class", "ac-content-header")
    contentHeader.innerText = "이런 분을 구합니다!"
    accompanyContent.appendChild(contentHeader)

    const contentBody = document.createElement("p")
    contentBody.innerText = accompanyData.content
    accompanyContent.appendChild(contentBody)

    row2InPurple.appendChild(accompanyContent)
    purpleBox.appendChild(row2InPurple)

    const row3InPurple = document.createElement("div")
    row3InPurple.setAttribute("class", "ac-row3-in-purple")

    // 동행글 최종 수정일
    const dateInfo = document.createElement("div")
    dateInfo.setAttribute("class", "ac-date-info")
    const span1 = document.createElement("span")
    span1.innerText = "최종 수정일"
    dateInfo.appendChild(span1)
    const span2 = document.createElement("span")
    span2.innerText = accompanyData.updated_at.split("T")[0]
    dateInfo.appendChild(span2)
    row3InPurple.appendChild(dateInfo)

    // 동행신청, 수정, 삭제 버튼
    const btngroup = document.createElement("div")
    btngroup.setAttribute("class", "ac-btn-group")
    // 동행신청 버튼
    const accApplyBtn = document.createElement("button")
    accApplyBtn.setAttribute("type", "button")
    accApplyBtn.setAttribute("class", "acc-apply-btn")
    accApplyBtn.innerText = "동행신청"
    btngroup.appendChild(accApplyBtn)
    if (payload) {
        if (payloadParse.user_id == accompanyData.user){
            // 수정 버튼
            const accUpdateBtn = document.createElement("button")
            accUpdateBtn.setAttribute("type", "button")
            accUpdateBtn.setAttribute("class", "acc-update-btn")
            accUpdateBtn.innerText = "수정"
            accUpdateBtn.addEventListener("click", function () {
                if (isEditingAccompany) {
                    alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
                } else {
                    isEditingAccompany = true
                    updateAccompany(grayBox, accompanyData)
                }
            })
            btngroup.appendChild(accUpdateBtn)

            // 삭제 버튼
            const accDeleteBtn = document.createElement("button")
            accDeleteBtn.setAttribute("type", "button")
            accDeleteBtn.setAttribute("class", "acc-delete-btn")
            accDeleteBtn.innerText = "삭제"
            accDeleteBtn.addEventListener("click", function () {
                deleteAccompany(grayBox, accompanyData)
            })
            btngroup.appendChild(accDeleteBtn)
        }
    }
    row3InPurple.appendChild(btngroup)
    purpleBox.appendChild(row3InPurple)     
    grayBox.appendChild(purpleBox)
    accompanyList.prepend(grayBox)
}

//------------------------------------------------------------------------------------------수정----------------------------------------------------------------
// 수정<->저장, 삭제<->취소 버튼 변환 시 필요한 코드
function removeExistingListeners(element, eventName) {
  let newElement = element.cloneNode(true)
  element.replaceWith(newElement)
  return newElement
}

// 수정 버튼 눌렀을 때 실행되는 함수
function updateAccompany(accompanyBox, accompanyData) {
    // 동행구하기 작성창 연 채로 수정 버튼 눌렀을 때 작성창 닫아주는 코드
    const accompanyPostBox = document.getElementById("accompanyPostBox")
    if (accompanyPostBox) {
        accompanyPostBox.parentElement.removeChild(accompanyPostBox)
    }
    // 동행구하기 버튼 다시 생기게 하기
    const showAcPosting = document.querySelector(".show-ac-posting")
    showAcPosting.style.display = "block"
    
    // 목표 인원
    let goalNumberElement = accompanyBox.querySelector(".ac-goal-number")
    const originPersonnel = accompanyData.personnel
    let personnel = accompanyBox.querySelector("#personnel")
    let personnelInputBox = accompanyBox.querySelector(".ap-goal-num")

    if (!personnelInputBox) {
        personnelInputBox = document.createElement("input")
        personnelInputBox.setAttribute("type", "number")
        personnelInputBox.setAttribute("class", "ap-goal-num")
        goalNumberElement.appendChild(personnelInputBox)

    }
    personnelInputBox.value = originPersonnel
    personnelInputBox.style.display = ""
    personnel.style.display = "none"

    // 인풋박스 옆에 '명' 글자 추가
    let nameElement = document.createElement("span")
    nameElement.textContent = "명"
    goalNumberElement.appendChild(nameElement)

    // 동행시간
    let setDateElement = accompanyBox.querySelector(".ac-set-date")
    setDateElement.setAttribute("style", "font-size:1.5vmin;")

    let startBox = accompanyBox.querySelector("#apStartTime") || false
    let endBox = accompanyBox.querySelector("#apEndTime") || false
    let originTime = accompanyBox.querySelector("#timeView")

    if (!startBox && !endBox) {
        startBox = document.createElement("input")
        startBox.setAttribute("type", "datetime-local")
        startBox.setAttribute("id", "apStartTime")
        startBox.setAttribute("style", "font-size:1.5vmin;")
        startBox.value = accompanyData.start_time
        setDateElement.appendChild(startBox)
        let wave = document.createElement("span")
        wave.innerText = " ~ "
        setDateElement.appendChild(wave)
        endBox = document.createElement("input")
        endBox.setAttribute("type", "datetime-local")
        endBox.setAttribute("id", "apEndTime")
        endBox.setAttribute("style", "font-size:1.5vmin;")
        endBox.value = accompanyData.end_time
        setDateElement.appendChild(endBox)
    }
    originTime.style.display = "none"

    // 이런 분을 구합니다!
    let accompanyTextElement = accompanyBox.querySelector(".ac-accompany-content")
    const accompanyText = accompanyData.content
    let textareaElement = accompanyBox.querySelector(".ac-accompany-content-textarea")

    if (!textareaElement) {
        textareaElement = document.createElement("textarea")
        textareaElement.setAttribute("class", "ac-accompany-content-textarea")
        accompanyTextElement.parentNode.appendChild(textareaElement)
    }

    textareaElement.innerText = accompanyText
    textareaElement.style.display = "block"
    accompanyTextElement.style.display = "none"
   
    // 수정 버튼을 저장 버튼으로 변경
    let saveBtn = accompanyBox.querySelector(".acc-update-btn")
    saveBtn.innerText = "저장"
    saveBtn = removeExistingListeners(saveBtn, "click")

    // 삭제 버튼을 취소 버튼으로 변경
    let cancelBtn = accompanyBox.querySelector(".acc-delete-btn")
    cancelBtn.innerText = "취소"
    cancelBtn = removeExistingListeners(cancelBtn, "click")

    saveBtn.onclick = (event) => {
        event.preventDefault()

        const newPersonnel = personnelInputBox.value
        const newAcContent = textareaElement.value
        const newStartTime = startBox.value
        const newEndTime = endBox.value

        // API 전달용 data
        const data = new FormData()
        data.append("personnel", newPersonnel)
        data.append("content", newAcContent)
        data.append("start_time", newStartTime)
        data.append("end_time", newEndTime)        

        putAccompanyAPI(accompanyData.id, data).then(({ response, responseJson }) => {
            if (response.status == 200) {
                alert(responseJson.message)
                // 수정된 목표인원 보이게 하고 인풋박스는 없애기
                personnel.innerText = `${responseJson.data.personnel}명`
                personnel.style.display = ""
                goalNumberElement.removeChild(personnelInputBox)
                goalNumberElement.removeChild(nameElement)

                // 수정된 동행시간 보이게 하고 원래 요소는 없애기
                originTime.style.display = ""
                originTime.innerText = `${responseJson.data.start_time.split("T")[0]} ${responseJson.data.start_time.split("T")[1].slice(0,5)} ~ ${responseJson.data.end_time.split("T")[0]} ${responseJson.data.end_time.split("T")[1].slice(0,5)}`
                setDateElement.removeChild(startBox)
                setDateElement.removeChild(endBox)
                setDateElement.removeChild(setDateElement.lastChild)       
                setDateElement.setAttribute("style", "font-size:2vmin;")

                // 수정된 리뷰 내용 보이게 하고 텍스트상자는 없애기
                accompanyTextElement.innerText = newAcContent
                accompanyTextElement.style.display = "block"
                textareaElement.style.display = "none"

                // 저장->수정, 취소->삭제
                saveBtn.innerText = "수정"
                saveBtn.onclick = function () {
                    if (isEditingAccompany) {
                        alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
                    } else {
                        isEditingAccompany = true
                        updateAccompany(accompanyBox, responseJson.data)
                    }                    
                }
                cancelBtn.innerText = "삭제"
                cancelBtn.onclick = function () {
                    deleteAccompany(accompanyBox, responseJson.data)
                }
            } else {
                alert(responseJson.message)
                textareaElement.style.display = "block"
            }            
        })
        isEditingAccompany = false // 수정 중인 상태가 아닌 것으로 변경
    }

    cancelBtn.onclick = (event) => {
        event.preventDefault()
        // 목표인원 되돌리기
        personnel.style.display = ""
        goalNumberElement.removeChild(personnelInputBox)
        goalNumberElement.removeChild(nameElement)

        // 동행시간 되돌리기
        originTime.style.display = ""
        setDateElement.removeChild(startBox)
        setDateElement.removeChild(endBox)
        setDateElement.removeChild(setDateElement.lastChild)    
        setDateElement.setAttribute("style", "font-size:2vmin;")

        // 내용 되돌리기
        accompanyTextElement.style.display = "block"
        textareaElement.style.display = "none"

        // 버튼 되돌리기
        saveBtn.innerText = "수정"
        saveBtn.onclick = function () {
            if (isEditingAccompany) {
                alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
            } else {
                isEditingAccompany = true
                updateAccompany(accompanyBox, accompanyData)
            }
        }
        cancelBtn.innerText = "삭제"
        cancelBtn.onclick = function () {
            deleteAccompany(accompanyBox, accompanyData)
        }

        isEditingAccompany = false // 수정 중인 상태가 아닌 것으로 변경
    }
}

//------------------------------------------------------------------------------------------삭제----------------------------------------------------------------
// 삭제 버튼 눌렀을 때 실행되는 함수
function deleteAccompany(accompanyBox, accompany) {
    if (confirm("정말 삭제하시겠습니까?")) {
        deleteAccompanyAPI(accompany.id).then((response) => {
            if (response.status == 204) {
                alert("삭제되었습니다.")
                accompanyBox.parentNode.removeChild(accompanyBox)
            }            
        })
    }
}