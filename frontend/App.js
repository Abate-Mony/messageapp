"use strict"
window.onload = function() {
    document.addEventListener('contextmenu', event => event.preventDefault());

    const messageBox = [...document.querySelectorAll(".messagebox")]
    const _children = [...document.querySelector(".main-container").children]
    const userBtn = document.getElementById("userBtn")
    const emjBtn = document.getElementById("emjBtn")
    const emjContainer = document.querySelector(".emj-container")
    const emjs = [...emjContainer.children]
    const userSelect = document.querySelector(".user-alert")
    var sec = 0
    var timer = null
    const moreOptionsContainer = document.querySelector(".moreoptions-container")
    changeView(1)

    function changeView(index) {
        _children.forEach(child => {
            child.style.transform = `translateX(-${index*100}%)`
        })
    }
    messageBox.forEach(box => {
        box.addEventListener("click", e => {
            changeView(2)
            scrolldown()
        })
    })
    $(".backBtn").click(function(e) {
        changeView(1)

        e.preventDefault();

    });
    userBtn.addEventListener("click", e => {
        changeView(0)


    })
    window.addEventListener("click", e => {
        _i = false
        if (!emjContainer.classList.contains("reverse")) {
            toggleEmjContainer(e)
        }!moreOptionsContainer.classList.contains("--d-none") && moreOptionsContainer.classList.add("--d-none")
        timer && clearInterval(timer)
        sec = 0
    })

    emjs.forEach((emj, index) => {
        emj.addEventListener("click", e => {
            e.stopPropagation()
        })
    })

    function toggleEmjContainer(e) {
        if (emjContainer.classList.contains("reverse")) {
            emjContainer.classList.remove("reverse")
            emjContainer.classList.add("verse")
        } else {
            emjContainer.classList.add("reverse")
            emjContainer.classList.remove("verse")
        }
        e.stopPropagation()
    }
    emjBtn.onclick = function(e) {
        toggleEmjContainer(e)
    }

    var __y = null
    var reset = false

    function scrolldown() {
        __y = $(".message-inner-chart-box")[0]
            .children[$(".message-inner-chart-box")[0]
                .children.length - 1].getBoundingClientRect().top

        if (document.querySelector(".message-inner-chart-box")) {
            const all = [...document.querySelector(".message-inner-chart-box").children]
            const elm = document.querySelector(".message-inner-chart-box")
            const height = all[all.length - 1].offsetTop
            document.querySelector(".message-inner-chart-box").scrollTo({
                top: height,
                left: 0,
                behavior: "smooth"
            })
            console.log(all.length)
            for (let j = 0; j < all.length; ++j) {
                for (let i = (j + 1); i < all.length; ++i) {
                    if ((all[j].classList.contains("flex-end") && all[i].classList.contains("flex-end")) ||
                        (all[j].classList.contains("recieve-message") &&
                            all[i].classList.contains("recieve-message"))) {
                        continue
                    } else {
                        all[j].style.marginTop = `3rem`
                        j = i - 1
                        break
                    }

                }

            }
            all.forEach((message, index) => {

                message.addEventListener("touchstart", e => {
                    clearInterval(timer)
                    moreOptionsContainer.style.height = "5rem"
                    _i = false
                    timer = setInterval(() => {
                        sec += 1
                        if (sec >= 1) {
                            clearInterval(timer)
                            sec = 0
                            moreOptionsContainer.children[0].innerHTML = `
                            <div class="drag-btn">
                            </div>
                            `
                            moreOptionsContainer.children[0].innerHTML += message.textContent
                            if (moreOptionsContainer.classList.contains("--d-none")) {
                                moreOptionsContainer.classList.remove("--d-none")
                                navigator.vibrate([50])
                            } else {
                                moreOptionsContainer.classList.add("--d-none")
                                clearInterval(timer)

                                let _timer = setInterval(() => {
                                    navigator.vibrate([50])
                                    moreOptionsContainer.classList.remove("--d-none")
                                    clearInterval(_timer)
                                    sec = 0
                                }, 50);
                            }
                            if (!emjContainer.classList.contains("reverse")) {
                                toggleEmjContainer(e)
                            }
                        }
                    }, 500);
                    e.stopPropagation()
                })
                message.addEventListener("touchend", e => {
                    clearInterval(timer)
                    sec = 0


                    e.stopPropagation()
                })

            })
        }

    }



    const innerChart = document.querySelector(".message-inner-chart")


    const position = {
        x: null,
        y: null
    }
    var touch = false
    var _h = null
    var _i = false
    moreOptionsContainer.addEventListener("touchstart", e => {
        position.y = moreOptionsContainer.getBoundingClientRect().height - (window.innerHeight - e.touches[0].clientY)
            // console.log(position.y)

    })
    innerChart.addEventListener("touchstart", e => {
        // console.log(e.touches[0].clientY)
        position.x = e.touches[0].clientY
        _i = true

        if (!moreOptionsContainer.classList.contains("--d-none") && (_i)) {
            // console.log("neeoo")
            _h = moreOptionsContainer.getBoundingClientRect().height
            touch = true
            innerChart.style.overflow = `hidden`
        }

    })
    innerChart.addEventListener("touchend", e => {
        touch = false
        position.y = 0
        position.x = 0
    })
    innerChart.addEventListener("touchmove", e => {
        if (touch) {

            var height = Math.abs(position.x - e.changedTouches[0].clientY)
            const __ = position.x - e.changedTouches[0].clientY
            if (__ => 0) {
                moreOptionsContainer.style.height = `${_h+height}px`
            }
            if (__ < 0) {
                moreOptionsContainer.style.height = `${_h-height}px`
            }
        }
    })
    innerChart.addEventListener("scroll", e => {
        console.log("scrolling here")
    })
    $(".message-inner-chart-box")[0].addEventListener("scroll", e => {
        const _y = $(".message-inner-chart-box")[0]
            .children[$(".message-inner-chart-box")[0]
                .children.length - 1].getBoundingClientRect().top - $(".message-inner-chart-box")[0]
            .children[$(".message-inner-chart-box")[0]
                .children.length - 1].offsetTop + innerHeight

        // console.log((_y / __y) * 100)
        // console.log(__y, _y)
    })
    moreOptionsContainer.onclick = function(e) {
            e.stopPropagation()
        }
        // setInterval(() => {
        //     userSelect.classList.toggle("slide-right")
        // }, 10000);

    const addtochats = () => {
        var val = $("#input").val();
        if (!val.length >= 1) return
        const text = $(".message-inner-chart-box")[0].innerHTML + `
        
        <div class="flex-end">
        <div class="send-message message">
           ${val}
        </div>
    </div>
        `
        $("#input").val("")
        $(".message-inner-chart-box").html(text);
        scrolldown()
    }
    $(".send_").click(function(e) {
        addtochats()
    });
    $("#input").keyup(function(e) {
        const keycode = e.keyCode
        if (keycode == 13) {
            addtochats()
        }
    })
    const searchElm = $("#__search")[0];
    const text = "Search user e.g Ako Bate "
    var i = 0
    setInterval(() => {
        $("#__search")[0].placeholder = text.slice(0, Math.abs(i))
        i > text.length - 1 ? i *= -1 : i += 1
    }, 100)

    $("#__search").click(function(e) {
        console.log(e)
        e.preventDefault();

    });
    $(".users-container").click(function(e) {
        changeView(2)
        e.preventDefault();

    });
    $(".mini-emj-container span").click(function(e) {
        const text = $("#input").val() + this.textContent.trim()
        $("#input").val(text)

        e.preventDefault();

    });


}