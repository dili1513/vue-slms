<template>
    <div>
        <div id="container-map" style="width:100%; height: 710px"></div>
        <ul class="tg-list" style="position:absolute; top: 10px; left: 80px">
            <li class="tg-list-item" style="font-weight: 600">
                路灯
                <input class="tgl tgl-flat" id="cb5" type="checkbox" checked="true" @click="changeLightVisible">
                <label class="tgl-btn" for="cb5"></label>
            </li>
        </ul>
        <ul class="tg-list" style="position:absolute; top: 70px; left: 80px">
            <li class="tg-list-item" style="font-weight: 600">
                管孔
                <input class="tgl tgl-flat" id="cb4" type="checkbox" @click="changePipeVisible">
                <label class="tgl-btn" for="cb4"></label>
            </li>
        </ul>
        <ul class="tg-list" style="position:absolute; top: 130px; left: 80px">
            <li class="tg-list-item" style="font-weight: 600">
                测距工具
                <input class="tgl tgl-flat-blue" id="cb3" type="checkbox" @click="changeRulerVisible">
                <label class="tgl-btn" for="cb3"></label>
            </li>
        </ul>
        <div id="tip">
            <i class="el-icon-search"></i>
            <input id="keyword" type="text" name="keyword" value="请输入关键字：(选定后搜索)" onfocus="this.value=''" onblur="this.value='请输入关键字：(选定后搜索)'">
        </div>
        <div class="table-wrapper">
            <div style="width: 100%; height: 20px; background-color: rgba(255, 255, 255, 0.8); text-align: center; font-size: 15px" @click="hiddenLightMeg">路灯信息
                <span :class="classObjL"></span>
            </div>
            <table v-if="lightTableVisible" class="fl-table">
                <tr>
                    <td>点击位置经纬度：</td>
                    <td style="text-decoration: underline">[{{ chosePosition.lng }}, {{ chosePosition.lat }}]</td>
                    <td>点击具体位置：</td>
                    <td style="text-decoration: underline">{{ chosePosition.location }}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>路灯节点ID：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.l_id }}</td>
                    <td>所挂载灯杆ID：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.p_id }}</td>
                    <td>路灯型号：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.type }}</td>
                </tr>
                <tr>
                    <td>工作状态：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.state }}</td>
                    <td>亮度：</td>
                    <td style="width: 140px">
                        <el-progress :percentage="choseLightNode.brightness * 20" :text-inside="true" :stroke-width="18" color="#fba953"></el-progress>
                    </td>
                    <td>路灯位置</td>
                    <td style="text-decoration: underline">[{{ choseCircle.center }}]</td>
                </tr>
                <tr>
                    <td>实际功率：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.power }}W</td>
                    <td>实际电压：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.voltage }}V</td>
                    <td>实际电流：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.current }}A</td>
                </tr>
                <tr>
                    <td>额定功率：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.rated_power }}W</td>
                    <td>额定电压：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.rated_voltage }}V</td>
                    <td>额定电流：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.rated_current }}A</td>
                </tr>
                <tr>
                    <td>生产日期：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.production_date }}</td>
                    <td>购买日期：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.purchase_date }}</td>
                    <td>安装日期：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.install_date }}</td>
                </tr>
                <tr>
                    <td>生产商：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.manufacturer }}</td>
                    <td>使用年限：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.life_time }}年</td>
                    <td>价格：</td>
                    <td style="text-decoration: underline">{{ choseLightNode.price }}年</td>
                </tr>
            </table>
            <div style="width: 100%; height: 20px; background-color: rgba(255, 255, 255, 0.8); text-align: center; font-size: 15px" @click="hiddenPipeMeg">管孔信息
                <span :class="classObjP"></span>
            </div>
            <table v-if="pipeTableVisible" class="fl-table">
                <tr>
                    <td>管孔编号：</td>
                    <td style="text-decoration: underline">{{ chosePipe.pp_num }}</td>
                    <td>管孔长度：</td>
                    <td style="text-decoration: underline">{{ chosePipe.length }}</td>
                    <td>总共管孔数：</td>
                    <td style="text-decoration: underline">{{ chosePipe.total_holes_num }}</td>
                    <td>可用管孔数：</td>
                    <td style="text-decoration: underline">{{ chosePipe.available_holes_num }}</td>
                </tr>
                <tr>
                    <td>管孔起点：</td>
                    <td style="text-decoration: underline">[{{ chosePipe.start_lng }}, {{ chosePipe.start_lat }}]</td>
                    <td>管孔终点：</td>
                    <td style="text-decoration: underline">[{{ chosePipe.end_lng }}, {{ chosePipe.end_lat }}]</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>

  import AMap from 'AMap'
  import AMapUI from 'AMapUI'

  export default {
    name: 'basicMapData',
    data() {
      return {
        map: null,
        ruler: null,
        classObjL: {
          'el-icon-caret-bottom': true,
          'el-icon-caret-top': false
        },
        classObjP: {
          'el-icon-caret-bottom': false,
          'el-icon-caret-top': true
        },
        lightTableVisible: true,
        pipeTableVisible: false,
        pole_nodes: [{
          p_id: '1',
          type: 'l1',
          longitude: 116.355039,
          latitude: 39.962067,
          position: '',
          height: 20,
          load_bearing: 1000,
          production_date: '2018-01-01',
          purchase_date: '2018-01-01',
          install_date: '2018-03-01',
          life_time: 120,
          warehouse_flag: false,
          manufacturer: 'aaa',
          price: 500
        },
          {
            p_id: '2',
            type: 'l2',
            longitude: 116.355039,
            latitude: 39.962167,
            position: '',
            height: 20,
            load_bearing: 1000,
            production_date: '2018-01-01',
            purchase_date: '2018-01-01',
            install_date: '2018-03-01',
            life_time: 120,
            warehouse_flag: false,
            manufacturer: 'aaa',
            price: 500
          },
          {
            p_id: '3',
            type: 'l3',
            longitude: 116.355039,
            latitude: 39.962267,
            position: '',
            height: 20,
            load_bearing: 1000,
            production_date: '2018-01-01',
            purchase_date: '2018-01-01',
            install_date: '2018-03-01',
            life_time: 120,
            warehouse_flag: false,
            manufacturer: 'aaa',
            price: 500
          },
          {
            p_id: '4',
            type: 'l4',
            longitude: 116.355039,
            latitude: 39.962367,
            position: '',
            height: 20,
            load_bearing: 1000,
            production_date: '2018-01-01',
            purchase_date: '2018-01-01',
            install_date: '2018-03-01',
            life_time: 120,
            warehouse_flag: false,
            manufacturer: 'aaa',
            price: 500
          },
          {
            p_id: '5',
            type: 'l5',
            longitude: 116.355039,
            latitude: 39.962467,
            position: '',
            height: 20,
            load_bearing: 1000,
            production_date: '2018-01-01',
            purchase_date: '2018-01-01',
            install_date: '2018-03-01',
            life_time: 120,
            warehouse_flag: false,
            manufacturer: 'aaa',
            price: 500
          }],
        light_nodes: [{
          l_id: '1',
          p_id: '1',
          type: 'a1',
          rated_power: 10,
          rated_voltage: 220,
          rated_current: 5,
          power: 100,
          voltage: 220,
          current: 5,
          production_date: '2018-01-01',
          purchase_date: '2018-01-01',
          install_date: '2018-03-01',
          life_time: '12',
          manufacturer: '飞利浦',
          price: 20,
          state: '工作中',
          brightness: 1
        },
          {
            l_id: '2',
            p_id: '2',
            type: 'a2',
            rated_power: 100,
            rated_voltage: 220,
            rated_current: 5,
            power: 100,
            voltage: 220,
            current: 5,
            production_date: '2018-01-01',
            purchase_date: '2018-01-01',
            install_date: '2018-03-01',
            life_time: '12',
            manufacturer: '飞利浦',
            price: 20,
            state: '待安装',
            brightness: 2
          },
          {
            l_id: '3',
            p_id: '3',
            type: 'a3',
            rated_power: 100,
            rated_voltage: 220,
            rated_current: 5,
            power: 100,
            voltage: 220,
            current: 5,
            production_date: '2018-01-01',
            purchase_date: '2018-01-01',
            install_date: '2018-03-01',
            life_time: '12',
            manufacturer: '飞利浦',
            price: 20,
            state: '关闭',
            brightness: 3
          },
          {
            l_id: '4',
            p_id: '4',
            type: 'b4',
            rated_power: 100,
            rated_voltage: 220,
            rated_current: 5,
            power: 100,
            voltage: 220,
            current: 5,
            production_date: '2018-01-01',
            purchase_date: '2018-01-01',
            install_date: '2018-03-01',
            life_time: '12',
            manufacturer: '飞利浦',
            price: 20,
            state: '工作中',
            brightness: 4
          },
          {
            l_id: '5',
            p_id: '5',
            type: 'a5',
            rated_power: 100,
            rated_voltage: 220,
            rated_current: 5,
            power: 100,
            voltage: 220,
            current: 5,
            production_date: '2018-01-01',
            purchase_date: '2018-01-01',
            install_date: '2018-03-01',
            life_time: '12',
            manufacturer: '飞利浦',
            price: 20,
            state: '故障',
            brightness: 5
          }],
        /* 当前位置 */
        thisPosition: {
          location: '',
          lng: '',
          lat: ''
        },
        /* 选取的位置 */
        chosePosition: {
          location: '',
          lng: '',
          lat: ''
        },
        /* 范围圆的数据 */
        myCircle: {},
        /* 签到圆对象 */
        circle: {},
        /* 编辑器对象 */
        circleEditor: null,
        /* 拖拽对象 */
        positionPickerObj: {},
        /* 当前城市编码 */
        citycode: '020',
        circles: [], // 路灯节点圆点标记
        pipeCircles: [], // 管孔端点圆点标记
        pipePolyline: [], // 管孔折线
        textL: [], // 存放管孔长度文本
        wellCircles: [], // 井节点圆点标记
        // 井信息
        well: [{
          w_id: '1',
          lng: 116.355050,
          lat: 39.962867,
          pp_num: '2'
        },
          {
            w_id: '2',
            lng: 116.355050,
            lat: 39.963267,
            pp_num: '3'
          }],
        // 管孔信息
        pipe: [{
          pp_num: '1',
          start_lng: 116.355050,
          start_lat: 39.962067,
          end_lng: 116.355050,
          end_lat: 39.962567,
          length: 20,
          total_holes_num: 10,
          available_holes_num: 9
        },
          {
            pp_num: '2',
            start_lng: 116.355050,
            start_lat: 39.962567,
            end_lng: 116.355050,
            end_lat: 39.963067,
            length: 30,
            total_holes_num: 10,
            available_holes_num: 7
          },
          {
            pp_num: '3',
            start_lng: 116.355050,
            start_lat: 39.963067,
            end_lng: 116.355050,
            end_lat: 39.963567,
            length: 40,
            total_holes_num: 5,
            available_holes_num: 3
          }],
        choseCircle: {},
        choseLightNode: {
          l_id: '',
          p_id: '',
          type: '',
          rated_power: 0,
          rated_voltage: 0,
          rated_current: 0,
          power: 0,
          voltage: 0,
          current: 0,
          production_date: '',
          purchase_date: '',
          install_date: '',
          life_time: '',
          manufacturer: '',
          price: 0,
          state: '',
          brightness: 0
        },
        chosePolyline: {},
        chosePipe: {
          pp_num: '',
          start_lng: 0,
          start_lat: 0,
          end_lng: 0,
          end_lat: 0,
          length: 0,
          total_holes_num: 0,
          available_holes_num: 0
        },
        infoWindow: null
      }
    },
    activated() {
    },
    created() {
      this.getInitInfo()
    },
    mounted() {
      this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, 0) })
      this.map = new AMap.Map('container-map', {
        resizeEnable: true,
        zoom: 15,
        viewMode: '2D',
        zooms: [4, 18]
      })
      const autoOptions = {
        city: '北京', // 城市，默认全国
        input: 'keyword'// 使用联想输入的input的id
      }
      const autocomplete = new AMap.Autocomplete(autoOptions)
      const placeSearch = new AMap.PlaceSearch({
        city: '北京',
        map: this.map
      })
      AMap.event.addListener(autocomplete, 'select', function(e) {
        // TODO 针对选中的poi实现自己的功能
        placeSearch.setCity(e.poi.adcode)
        placeSearch.search(e.poi.name)
      })
      this.ruler = new AMap.RangingTool(this.map)
      /* 添加工具条 */
      this.addTool()
      /* 获取当前位置 */
      this.thisLocation()
      /* 添加搜索功能 */
      this.search()
      this.map.on('click', this.getClickPosition)
    },
    methods: {
      async getInitInfo() { // 使用异步，获取信息后再加载路灯节点
        const lightRes = await this.getRequest('/basicData/map/lights')
        this.light_nodes = lightRes
        console.log(lightRes)
        const poleRes = await this.getRequest('/basicData/map/poles')
        this.pole_nodes = poleRes
        const pipeRes = await this.getRequest('/basicData/map/pipes')
        this.pipe = pipeRes
        const wellRes = await this.getRequest('/basicData/map/wells')
        this.well = wellRes
        this.clearLightNodes(this.circles)
        this.drawLightNodes(this.light_nodes, this.circles)
        this.clearPipes(this.pipeCircles, this.textL, this.pipePolyline)
        this.drawPipes(this.pipe, this.pipeCircles, this.textL, this.pipePolyline)
        this.clearWells(this.wellCircles)
        this.drawWells(this.well, this.wellCircles)
      },
      clearLightNodes(circles) {
        let i
        if (circles.length !== 0) {
          for (i = 0; i < circles.length; i++) {
            circles[i].setMap(null)
          }
        }
        circles.length = 0
        circles = []
      },
      clearPipes(pipeCircles, textL, pipePolyline) {
        let i
        if (pipeCircles.length !== 0) {
          for (i = 0; i < pipeCircles.length; i++) {
            pipeCircles[i].setMap(null)
          }
        }
        pipeCircles.length = 0
        pipeCircles = []
        if (textL.length !== 0) {
          for (i = 0; i < textL.length; i++) {
            textL[i].setMap(null)
          }
        }
        textL.length = 0
        textL = []
        if (pipePolyline.length !== 0) {
          for (i = 0; i < pipePolyline.length; i++) {
            pipePolyline[i].setMap(null)
          }
        }
        pipePolyline.length = 0
        pipePolyline = []
      },
      clearWells(wellCircles) {
        let i
        if (wellCircles.length !== 0) {
          for (i = 0; i < wellCircles.length; i++) {
            wellCircles[i].setMap(null)
          }
        }
        wellCircles.length = 0
        wellCircles = []
      },
      drawLightNodes(light_nodes, circles) {
        let i = 0
        let pos = [0, 0]
        // 将路灯节点绘制在地图中
        for (i = 0; i < light_nodes.length; i++) {
          console.log('信息：')
          console.log(light_nodes[i])
          pos = this.getLightPosition(light_nodes[i].p_id) // 根据灯杆ID获取灯杆位置
          const circle = new AMap.CircleMarker({
            center: pos,
            radius: 5, // 半径
            borderWeight: 3,
            strokeColor: '#FF33FF',
            strokeWeight: 2,
            strokeOpacity: 0,
            fillOpacity: 1,
            strokeStyle: 'dashed',
            strokeDasharray: [10, 10],
            // 线样式还支持 'dashed'
            fillColor: 'red',
            zIndex: 50,
            bubble: true,
            draggable: false,
            extData: light_nodes[i]
          })
          circles.push(circle)
        }
        for (i = 0; i < circles.length; i++) {
          switch (circles[i].getOptions().extData.state) {
            case '故障':
              circles[i].setOptions({ fillColor: 'red' })
              break
            case '关闭':
              circles[i].setOptions({ fillColor: 'gray' })
              break
            case '工作中':
              circles[i].setOptions({ fillColor: 'green' })
              circles[i].setOptions({ fillOpacity: circles[i].getOptions().extData.brightness / 5 })
              break
            case '待安装':
              circles[i].setOptions({ fillColor: 'orange' })
              break
          }
          circles[i].setMap(this.map)
          // 缩放地图到合适的视野级别
          this.map.setFitView([circles[i]])
          circles[i].content = 'ID:' + circles[i].getOptions().extData.l_id + ', 工作状态:' + circles[i].getOptions().extData.state
          circles[i].on('mouseover', this.pointMouseOver)
          // this.circles[i].emit('mouseover', { target: this.circles[i] })
          circles[i].on('mouseout', this.pointMouseOut)
          // this.circles[i].emit('mouseout', { target: this.circles[i] })
          circles[i].on('click', this.circleClick)
          // this.circles[i].emit('click', { target: this.circles[i] })
        }
      },
      drawPipes(pipe, pipeCircles, textL, pipePolyline) {
        let i = 0
        let start = [0, 0]
        let end = [0, 0]
        let pl = {}
        // 管孔绘制
        for (i = 0; i < pipe.length; i++) {
          start = new AMap.CircleMarker({
            center: [pipe[i].start_lng, pipe[i].start_lat],
            radius: 3.5, // 半径
            strokeColor: '#ffffff',
            strokeWeight: 1,
            strokeOpacity: 1,
            fillOpacity: 0.8,
            // 线样式还支持 'dashed'
            fillColor: '#434343',
            zIndex: 45,
            bubble: true,
            extData: { id: pipe[i].id }
          })
          end = new AMap.CircleMarker({
            center: [pipe[i].end_lng, pipe[i].end_lat],
            radius: 3.5, // 半径
            strokeColor: '#ffffff',
            strokeWeight: 1,
            strokeOpacity: 1,
            fillOpacity: 0.8,
            // 线样式还支持 'dashed'
            fillColor: '#434343',
            zIndex: 45,
            bubble: true,
            extData: { id: pipe[i].id }
          })
          pipeCircles.push(start)
          pipeCircles.push(end)
          start.setMap(this.map)
          end.setMap(this.map)
          start.hide()
          end.hide()
          // 画中点
          const mid = this.getMidPoint([pipe[i].start_lng, pipe[i].start_lat], [pipe[i].end_lng, pipe[i].end_lat])
          const text = new AMap.Text({
            text: pipe[i].length + 'M',
            style: {
              'padding': '.75rem 1.25rem',
              'margin-bottom': '1rem',
              'border-radius': '.25rem',
              'background-color': 'transparent',
              'width': '15rem',
              'border-width': 0,
              'text-align': 'center',
              'font-size': '12px',
              'font-weight': '700',
              'color': 'black'
            },
            position: mid,
            extData: { id: pipe[i].id }
          })
          textL.push(text)
          text.setMap(this.map)
          text.hide()
          pl = new AMap.Polyline({
            path: [
              [pipe[i].start_lng, pipe[i].start_lat],
              [pipe[i].end_lng, pipe[i].end_lat]
            ],
            isOutline: true,
            outlineColor: '#cccccc',
            borderWeight: 1,
            strokeColor: '#837e7e',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            // 折线样式还支持 'dashed'
            strokeStyle: 'dashed',
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 10],
            lineJoin: 'round',
            lineCap: 'square',
            zIndex: 40,
            bubble: true,
            extData: pipe[i]
          })
          pipePolyline.push(pl)
          pl.setMap(this.map)
          pl.on('click', this.polylineClick)
          // pl.emit('click', { target: pl })
          pl.hide()
          // 缩放地图到合适的视野级别
          this.map.setFitView([pl])
        }
      },
      drawWells(well, wellCircles) {
        let i = 0
        // 井绘制
        for (i = 0; i < well.length; i++) {
          const circle = new AMap.CircleMarker({
            center: [well[i].lng, well[i].lat],
            radius: 6, // 半径
            strokeColor: '#000000',
            strokeWeight: 2,
            strokeOpacity: 0.8,
            fillOpacity: 0.8,
            strokeStyle: 'dashed',
            strokeDasharray: [7, 7],
            // 线样式还支持 'dashed'
            fillColor: '#524a4a',
            zIndex: 50,
            bubble: true,
            draggable: false,
            extData: well[i]
          })
          circle.setMap(this.map)
          circle.hide()
          wellCircles.push(circle)
        }
      },
      getMidPoint(start, end) { // 获取线段中点，用于展示管孔长度时获取显示长度的文本位置
        let x = 0
        let y = 0
        const lnglatS = new AMap.LngLat(start[0], start[1])
        const pixelS = this.map.lngLatToContainer(lnglatS) // 获得 Pixel 对象
        const lnglatE = new AMap.LngLat(end[0], end[1])
        const pixelE = this.map.lngLatToContainer(lnglatE) // 获得 Pixel 对象
        x = (pixelS.x + pixelE.x) / 2
        y = (pixelS.y + pixelE.y) / 2
        const pixelM = new AMap.Pixel(x, y)
        // 获得 LngLat 对象
        return this.map.containerToLngLat(pixelM)
      },
      changeRulerVisible(e) { // 点击按钮改变测距工具的隐藏和展示
        const checked = e.target.checked
        if (checked === true) {
          this.ruler.turnOn()
        } else {
          this.ruler.turnOff()
        }
      },
      changeLightVisible(e) { // 点击按钮改变路灯节点的隐藏和展示
        const checked = e.target.checked
        let i
        if (checked === true) {
          for (i = 0; i < this.circles.length; i++) {
            this.circles[i].show()
          }
        } else {
          for (i = 0; i < this.circles.length; i++) {
            this.circles[i].hide()
          }
        }
      },
      changePipeVisible(e) { // 点击按钮改变管孔的隐藏和展示
        const checked = e.target.checked
        let i
        if (checked === true) {
          for (i = 0; i < this.pipePolyline.length; i++) {
            this.pipePolyline[i].show()
          }
          for (i = 0; i < this.pipeCircles.length; i++) {
            this.pipeCircles[i].show()
          }
          for (i = 0; i < this.textL.length; i++) {
            this.textL[i].show()
          }
          for (i = 0; i < this.wellCircles.length; i++) {
            this.wellCircles[i].show()
          }
        } else {
          for (i = 0; i < this.pipePolyline.length; i++) {
            this.pipePolyline[i].hide()
          }
          for (i = 0; i < this.pipeCircles.length; i++) {
            this.pipeCircles[i].hide()
          }
          for (i = 0; i < this.textL.length; i++) {
            this.textL[i].hide()
          }
          for (i = 0; i < this.wellCircles.length; i++) {
            this.wellCircles[i].hide()
          }
        }
      },
      getLightPosition(p_id) { // 根据pid获取路灯所在灯杆的位置
        let i = 0
        let center = [0, 0]
        for (i = 0; i < this.pole_nodes.length; i++) {
          if (this.pole_nodes[i].p_id === p_id) {
            center = [this.pole_nodes[i].longitude, this.pole_nodes[i].latitude]
            break
          }
        }
        return center
      },
      hiddenLightMeg() {
        this.classObjL['el-icon-caret-bottom'] = !this.classObjL['el-icon-caret-bottom']
        this.classObjL['el-icon-caret-top'] = !this.classObjL['el-icon-caret-top']
        this.lightTableVisible = !this.lightTableVisible
      },
      hiddenPipeMeg() {
        this.classObjP['el-icon-caret-bottom'] = !this.classObjP['el-icon-caret-bottom']
        this.classObjP['el-icon-caret-top'] = !this.classObjP['el-icon-caret-top']
        this.pipeTableVisible = !this.pipeTableVisible
      },
      getState(state) {
        let result = ''
        switch (state) {
          case -1:
            result = '故障'
            break
          case 0:
            result = '关闭'
            break
          case 1:
            result = '工作中'
            break
          case 2:
            result = '待安装'
            break
        }
        return result
      },
      pointMouseOver(e) {
        this.infoWindow.setContent(e.target.content)
        this.infoWindow.open(this.map, e.target.F.center)
      },
      pointMouseOut(e) {
        this.infoWindow.close()
      },
      circleClick(e) {
        this.choseCircle = e.target.F
        this.choseLightNode = e.target.F.extData
        this.classObjL['el-icon-caret-bottom'] = true
        this.classObjL['el-icon-caret-top'] = false
        this.lightTableVisible = true
      },
      polylineClick(e) {
        this.chosePolyline = e.target.F
        this.chosePipe = e.target.F.extData
        this.classObjP['el-icon-caret-bottom'] = true
        this.classObjP['el-icon-caret-top'] = false
        this.pipeTableVisible = true
      },
      getClickPosition(e) {
        this.chosePosition.lng = e.lnglat.getLng()
        this.chosePosition.lat = e.lnglat.getLat()
        const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()]
        const geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        })
        geocoder.getAddress(lnglatXY, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.chosePosition.location = result.regeocode.formattedAddress
          } else {
            console.log('error')
          }
        })
      },
      /* 添加工具条 */
      addTool() {
        AMap.plugin(['AMap.ToolBar', 'AMap.Driving'], () => {
          const toolbar = new AMap.ToolBar()
          this.map.addControl(toolbar)
        })
      },
      /* 定位具体位置 */
      thisLocation() {
        this.map.plugin('AMap.Geolocation', () => {
          const geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000,
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonOffset: new AMap.Pixel(10, 20),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: false,
            //  定位按钮的排放位置,  RB表示右下
            buttonPosition: 'RB'
          })
          this.map.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', (data) => {
            console.log(data)
            this.citycode = data.addressComponent.cityCode
            this.thisPosition = data.position
            this.thisPosition.location = data.formattedAddress
            this.chosePosition = this.thisPosition
            /* 画圆 */
            this.cancelLocation()
            // this.addCircle()
            /* 拖拽选址 */
            this.positionPicker()
          })
          AMap.event.addListener(geolocation, 'error', function(data) {
            alert('定位失败')
          })
        })
      },
      /* 画图 */
      // addCircle() {
      //   this.myCircle = {
      //     center: [this.chosePosition.lng, this.chosePosition.lat], // 圆心位置
      //     radius: 300, // 半径
      //     strokeColor: '#FFFF00', // 线颜色
      //     strokeOpacity: 0.2, // 线透明度
      //     strokeWeight: 1, // 线粗细度
      //     fillColor: '#222222', // 填充颜色
      //     fillOpacity: 0.2// 填充透明度
      //   }
      //   this.circle = new AMap.Circle(this.myCircle)
      //   this.circle.setMap(this.map)
      //   // 引入多边形编辑器插件
      //   this.map.plugin(['AMap.CircleEditor'], () => {
      //     // 实例化多边形编辑器，传入地图实例和要进行编辑的多边形实例
      //     this.circleEditor = new AMap.CircleEditor(this.map, this.circle)
      //     // 开启编辑模式
      //     this.circleEditor.open()
      //     this.myCircle.radius = this.circle.Mg.radius
      //     this.circleEditor.on('adjust', (data) => {
      //       this.myCircle.radius = data.radius
      //     })
      //     this.circleEditor.on('move', (data) => {
      //       console.log('移动')
      //       this.chosePosition.lng = data.lnglat.lng
      //       this.chosePosition.lat = data.lnglat.lat
      //     })
      //   })
      // },
      /* 取消圆 */
      cancelLocation() {
        this.map.remove(this.circle)
        if (this.circleEditor) {
          this.circleEditor.close()
        }
      },
      /* 搜索 */
      search() {
        const vm = this
        AMap.plugin(['AMap.PlaceSearch', 'AMap.Autocomplete'], () => {
          var autoOptions = {
            city: this.citycode,
            input: 'input_id'
          }
          // eslint-disable-next-line no-unused-vars
          const autoComplete = new AMap.Autocomplete(autoOptions)
          // eslint-disable-next-line no-unused-vars
          const placeSearch = new AMap.PlaceSearch({
            city: this.citycode,
            map: vm.map
          })
          AMap.event.addListener(autoComplete, 'select', e => {
            // TODO 针对选中的poi实现自己的功能
            placeSearch.setCity(e.poi.adcode)
            // placeSearch.search(e.poi.name)
            this.chosePosition = e.poi.location
            if (this.chosePosition) {
              /* 画圆 */
              this.cancelLocation()
              // this.addCircle()
              /* 拖拽选址 */
              this.positionPickerObj.stop()
              this.positionPicker()
              this.createWindow()
            }
          })
        })
      },
      /* 获取覆盖物信息 */
      getMaker() {
        var overlaysList = this.map.getAllOverlays('circle')
        console.log(overlaysList)
        // 可选参数有:‘marker’、‘circle’、‘polyline’、‘polygon
      },
      /* 拖拽选址 */
      positionPicker() {
        AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
          this.positionPickerObj = new PositionPicker({
            mode: 'dragMarker', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
            map: this.map // 依赖地图对象
          })
          this.positionPickerObj.on('success', (positionResult) => {
            this.chosePosition = positionResult.position
            /* 画圆 */
            this.cancelLocation()
            // this.addCircle()
          })
          this.positionPickerObj.start([this.chosePosition.lng, this.chosePosition.lat])
        })
      },
      /* 创建信息窗体 */
      createWindow() {
        // 信息窗体的内容
        var content = [
          '<div style="width: 100%;>',
          '<div class="fs-16">范围: 200米</div>',
          '<div class="fs-14">位置不准确？试试拖拽鼠标或者输入地点</div></div>'
        ]
        // 创建 infoWindow 实例
        var infoWindow = new AMap.InfoWindow({
          content: content.join('<br>'), // 传入 dom 对象，或者 html 字符串
          offset: new AMap.Pixel(0, -50)
        })
        // 打开信息窗体
        infoWindow.open(this.map, this.chosePosition)
      }
    }
  }
</script>

<style scoped>
    .amap-wrapper {
        width: 100%;
        height: 100%;
    }
    #tip {
        background-color: #ddf;
        color: #333;
        border: 1px solid silver;
        box-shadow: 3px 4px 3px 0 silver;
        position: absolute;
        top: 10px;
        right: 10px;
        border-radius: 5px;
        overflow: hidden;
        line-height: 20px;
    }
    #tip input[type="text"] {
        height: 25px;
        border: 0;
        padding-left: 5px;
        width: 280px;
        border-radius: 3px;
        font-size: 12px;
    }
    .position {
        background-color: #ddf;
        color: #333;
        border: 1px solid silver;
        box-shadow: 3px 4px 3px 0 silver;
        position: absolute;
        top: 10px;
        right: 330px;
        border-radius: 5px;
        overflow: hidden;
        line-height: 20px;
        height: 25px;
        width: 280px;
    }

    .table-wrapper{
        /*margin: 10px 70px 70px;*/
        box-shadow: 0px 35px 50px rgba( 0, 0, 0, 0.2 );
        width: 100%;
        position: absolute;
        bottom: 0;
    }

    .fl-table {
        border-radius: 5px;
        font-size: 12px;
        font-weight: 600;
        border: none;
        border-collapse: collapse;
        width: 100%;
        max-width: 100%;
        white-space: nowrap;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .fl-table td, .fl-table th {
        text-align: center;
        padding: 8px;
    }

    .fl-table td {
        border-right: 1px solid #f8f8f8;
        font-size: 12px;
    }

    .fl-table thead th {
        color: #ffffff;
        background: #4FC3A1;
    }

    .fl-table thead th:nth-child(odd) {
        color: #ffffff;
        background: #324960;
    }

    .fl-table tr:nth-child(even) {
        background: rgba(255, 255, 255, 0.7);
    }

    /* Responsive */

    @media (max-width: 767px) {
        .fl-table {
            display: block;
            width: 100%;
        }

        .table-wrapper:before {
            content: "Scroll horizontally >";
            display: block;
            text-align: right;
            font-size: 11px;
            color: white;
            padding: 0 0 10px;
        }

        .fl-table thead, .fl-table tbody, .fl-table thead th {
            display: block;
        }

        .fl-table thead th:last-child {
            border-bottom: none;
        }

        .fl-table thead {
            float: left;
        }

        .fl-table tbody {
            width: auto;
            position: relative;
            overflow-x: auto;
        }

        .fl-table td, .fl-table th {
            padding: 20px .625em .625em .625em;
            height: 60px;
            vertical-align: middle;
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: auto;
            width: 120px;
            font-size: 13px;
            text-overflow: ellipsis;
        }

        .fl-table thead th {
            text-align: left;
            border-bottom: 1px solid #f7f7f9;
        }

        .fl-table tbody tr {
            display: table-cell;
        }

        .fl-table tbody tr:nth-child(odd) {
            background: none;
        }

        .fl-table tr:nth-child(even) {
            background: transparent;
        }

        .fl-table tr td:nth-child(odd) {
            background: #F8F8F8;
            border-right: 1px solid #E6E4E4;
        }

        .fl-table tr td:nth-child(even) {
            border-right: 1px solid #E6E4E4;
        }

        .fl-table tbody td {
            display: block;
            text-align: center;
        }
    }
    /*按钮样式*/
    ul,
    li {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .tg-list {
        text-align: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .tg-list-item {
        margin: 0;
    }

    .tgl {
        display: none;
    }
    .tgl, .tgl:after, .tgl:before, .tgl *, .tgl *:after, .tgl *:before, .tgl + .tgl-btn {
        box-sizing: border-box;
    }
    .tgl::-moz-selection, .tgl:after::-moz-selection, .tgl:before::-moz-selection, .tgl *::-moz-selection, .tgl *:after::-moz-selection, .tgl *:before::-moz-selection, .tgl + .tgl-btn::-moz-selection {
        background: none;
    }
    .tgl::selection, .tgl:after::selection, .tgl:before::selection, .tgl *::selection, .tgl *:after::selection, .tgl *:before::selection, .tgl + .tgl-btn::selection {
        background: none;
    }
    .tgl + .tgl-btn {
        outline: 0;
        display: block;
        width: 4em;
        height: 2em;
        position: relative;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .tgl + .tgl-btn:after, .tgl + .tgl-btn:before {
        position: relative;
        display: block;
        content: "";
        width: 50%;
        height: 100%;
    }
    .tgl + .tgl-btn:after {
        left: 0;
    }
    .tgl + .tgl-btn:before {
        display: none;
    }
    .tgl:checked + .tgl-btn:after {
        left: 50%;
    }

    .tgl-flat + .tgl-btn {
        padding: 2px;
        -webkit-transition: all .2s ease;
        transition: all .2s ease;
        background: #fff;
        border: 4px solid #f2f2f2;
        border-radius: 2em;
    }
    .tgl-flat + .tgl-btn:after {
        -webkit-transition: all .2s ease;
        transition: all .2s ease;
        background: #f2f2f2;
        content: "";
        border-radius: 1em;
    }
    .tgl-flat:checked + .tgl-btn {
        border: 4px solid #7FC6A6;
    }
    .tgl-flat:checked + .tgl-btn:after {
        left: 50%;
        background: #7FC6A6;
    }

    .tgl-flat-blue + .tgl-btn {
        padding: 2px;
        -webkit-transition: all .2s ease;
        transition: all .2s ease;
        background: #fff;
        border: 4px solid #f2f2f2;
        border-radius: 2em;
    }
    .tgl-flat-blue + .tgl-btn:after {
        -webkit-transition: all .2s ease;
        transition: all .2s ease;
        background: #f2f2f2;
        content: "";
        border-radius: 1em;
    }
    .tgl-flat-blue:checked + .tgl-btn {
        border: 4px solid #6d9eeb;
    }
    .tgl-flat-blue:checked + .tgl-btn:after {
        left: 50%;
        background: #6d9eeb;
    }
</style>
