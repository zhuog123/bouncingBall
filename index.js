//方塊
class Square {
    constructor(ele) {
        this.box = document.querySelector(ele)

        this.x = 0
        this.y = 0
        this.obj = {
            a: [],
            b: []
        }

        this.repeatMake(10)
    }

    //製作一個方塊
    make() {
        //生成範圍
        let box_width = this.box.clientWidth
        let box_hight = this.box.clientHeight

        //計算範圍的長跟寬分別能放多少方塊，目的是讓方塊不會跟其他重疊
        //一個方塊是 50px * 50px
        let row = box_width / 50 - 1
        let col = box_hight / 50 - 1

        //設置開關，如果開關值是 false 就不繼續循環
        let ok = false
        let ran_x
        let ran_y

        do {
            ok = false
            //隨機挑選位置
            ran_x = Math.floor(Math.random() * (row + 1))
            ran_y = Math.floor(Math.random() * (col + 1))

            //確認挑選的位置跟陣列中記錄的 x .y 位置沒有重疊
            //如果重疊了就把開關打開重複循環
            for (let i = 0; i < this.obj.a.length; i++) {
                if (ran_x === this.obj.a[i] && ran_y === this.obj.b[i]) {
                    ok = true
                    break
                }
            }
        } while (ok)


        //記錄到陣列中
        this.obj.a.push(ran_x)
        this.obj.b.push(ran_y)

        //換算成實際要放的位置
        this.x = ran_x * 50
        this.y = ran_y * 50

        //製作方塊並賦值
        let square = document.createElement('div');
        square.classList.add('square');
        square.style.left = this.x + 'px';
        square.style.top = this.y + 'px';
        this.box.appendChild(square);
    }

    //重複製作
    repeatMake(num) {
        //每一次製作時保證紀錄陣列為空
        this.obj = {
            a: [],
            b: []
        }
        //總共做10個方塊
        for (let i = 1; i <= num; i++) {
            this.make()
        }
    }
}

let s1 = new Square('.box')


let box = document.querySelector('.box')
let board = document.querySelector('.board');
box.addEventListener('mousemove', function (e) {


    let boxRect = box.getBoundingClientRect(); // 修改：获取盒子相对于视口的位置
    let offsetX = e.clientX - boxRect.left; // 修改：使用 clientX 减去盒子左边位置
    let boardWidth = board.offsetWidth; //板子的寬
    if (offsetX > boxRect.width - boardWidth / 2) { // 修改：修正边界判断
        board.style.left = boxRect.width - 12 - boardWidth + 'px'; //因為取得的寬是有包含邊框的，所以要再減去邊框的距離 6*2
    } else if (offsetX < boardWidth / 2) { // 修改：修正边界判断
        board.style.left = 0 + 'px';
    } else {
        board.style.left = (offsetX - boardWidth / 2) + 'px';
    }
    // if (e.target.classList.value === 'box') {
    //     //拿到 board 元素並改變樣式
    //     if (e.offsetX > 845) {
    //         e.target.children[0].style.left = 845 + 'px'
    //     } else if (e.offsetX < 0) {
    //         e.target.children[0].style.left = 0 + 'px'
    //     } else {
    //         e.target.children[0].style.left = (e.offsetX + 5) + 'px'
    //     }
    //     //本來想用以下表達式，但測試時發現移到左側會溢出 1px
    //     // e.target.children[0].style.left = e.offsetX > 845 ? 845 + 'px' : Math.floor((e.offsetX + 5)) + 'px'
    // }
})

//取得球元素
let ball = document.querySelector('.ball')
//球的初始行進方向
let run_x = 5
let run_y = 5

function bomb() {
    //球可以到達的邊界
    let box_width = box.clientWidth - ball.clientWidth
    let box_hight = box.clientHeight - ball.clientHeight

    //獲取球目前的位置
    let current_x = parseInt(ball.style.left) || 0
    let current_y = parseInt(ball.style.top) || 0

    //獲取 board 的實時位置
    let board_x = parseInt(board.style.left) || 0
    let board_y = parseInt(window.getComputedStyle(board).top) //因為板子高度是固定且設置在非行內樣式

    //還沒碰到前一直++  //碰到邊了就一直--
    if (current_x < 0 || current_x > box_width) {
        run_x = -1 * run_x
    }
    if (current_y < 0 || current_y > box_hight) {
        run_y = -1 * run_y
    }

    //在這裡而非在外部獲取方塊元素集合的原因是
    //方塊元素集合會隨著被球碰到而改變，所以如果是在外部獲取，這裡的遍歷依舊會遍歷包含已刪除與未刪除的方塊
    //從而導致球的運行軌跡發生飄移
    let square = document.querySelectorAll('.square')
    square.forEach((item) => {

        let square_x = parseInt(item.style.left) || 0
        let square_y = parseInt(item.style.top) || 0

        //判斷球是否碰到方塊
        if (current_x + 50 > square_x && current_x < square_x + 50 && current_y <= square_y + 50 && current_y + 50 >= square_y) {
            if (current_y + 50 >= square_y && current_y < square_y) { //如果球從上面往下
                run_y = -1 * run_y
            } else if (current_y <= square_y + 50 && current_y + 50 > square_y) { //如果球從下面往上
                run_y = -1 * run_y
            } else if (current_x + 50 >= square_x && current_x < square_x) { //如果球從左邊往右
                run_x = -1 * run_x
            } else if (current_x <= square_x + 50 && current_x + 50 > square_x) { //如果球從右邊往左
                run_x = -1 * run_x
            }

            item.remove()
            if (box.childElementCount === 2) {
                confirm('遊戲結束')
                clearInterval(time)
            }
        }
    })

    //怎麼能確定球碰到板子了？//球的 y 位置跟板子一樣 && 球的 x 位置在板子的寬度範圍內
    //從上面下來的球 y 位置如果是 450 px //從下面上來的球 y 位置如果是 450+6 px
    //判斷條件1：確認球的y現在是運行正還負 2：球的 y 目前位置有沒有碰到板子 3：球的 x 加上自己的長度有沒有在板子左邊邊界內 4：球的 x 有沒有在板子右邊邊界內
    // if (Math.sign(run_y) === 1 && current_y + 50 === board_y && current_x + 50 > board_x && current_x < board_x + 150) {
    //     run_y = -1 * run_y
    //     // console.log('球的位置從上面來且跟板子交叉了')
    // } else if (Math.sign(run_y) === -1 && current_y === board_y && current_x + 50 > board_x && current_x < board_x + 150) {
    //     run_y = -1 * run_y
    //     // console.log('球的位置從下面來且跟板子交叉了')
    // }

    if (current_x + 50 > board_x && current_x < board_x + 150 && current_y <= board_y + 6 && current_y + 50 >= board_y) {
        if (run_y > 0) { //如果球從上面往下
            //讓球碰到板子有一個 50 px 的加速度
            current_y -= 50
        } else if (run_y < 0) { //如果球從下面往上
            current_y += 50
        }
        run_y = -1 * run_y
    }

    //計算出運行方向之後賦值給球
    current_x += run_x
    current_y += run_y
    ball.style.left = current_x + 'px'
    ball.style.top = current_y + 'px'
}


// function Delete() {
//     let current_x = parseInt(ball.style.left) || 0
//     let current_y = parseInt(ball.style.top) || 0

//     square.forEach(item => {
//         let square_x = parseInt(item.style.left) || 0
//         let square_y = parseInt(item.style.top) || 0

//         //判斷上+下
//         if (current_x + 50 >= square_x && current_x <= square_x + 50) {
//             if (current_y + 50 >= square_y || current_y <= square_y + 50) {
//                 item.remove()
//             }
//         }

//         //判斷左+右
//         if (current_y + 50 >= square_y && current_y <= square_y + 50) {
//             if (current_x + 50 >= square_x || current_x <= square_x + 50) {
//                 item.remove()
//             }
//         }
//     })
// }


let time = setInterval(function () {
    bomb()
}, 10)


