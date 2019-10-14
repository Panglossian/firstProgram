(function (Vue) {
	// 封装作用域
	// const list_data = [
	// 	{ id: 1, title: '吃饭', stat: false },
	// 	{ id: 2, title: '约会', stat: false },
	// 	{ id: 3, title: '看电影', stat: true },
	// ]


	// // Your starting point. Enjoy the ride!
	var app = new Vue({
		el: '#todoapp',
		data: {
			title: 'todolists',
			list_data: ''


		},
		// 生命周期的钩子函数
		mounted: function () {
			// 获取所有数据
			axios.get('http://localhost:3000/listdata')
				.then((backdata) => {
					// console.log(backdata);
					this.list_data = backdata.data

				})
		},
		// 设置自定义私有指令
		// 自动获取文本框的焦点
		// directives: {
		// 	focus: {
		// 		inserted: (element) => {
		// 			element.focus();
		// 		}
		// 	}
		// },
		methods: {
			addTodo(ev) {
				// console.log('111');
				// 要获取文本框的内容
				// 文本框的结点对象 ev.target
				// console.log(ev.target);
				// var title = ev.target.value;
				var title = this.$refs.inp.value.trim();
				// title = title.trim()
				if (title == '') {
					return;
				}
				var id = this.list_data.length + 1 + 1;
				var stat = false;
				// 修改数据,
				var obj_data = { id, title, stat }
				//将数据写入数据库
				axios.post('http://localhost:3000/listdata', obj_data)
					.then((backdata) => {
						// 对象的解构赋值
						let { data, status } = backdata
						if (status == 201) {
							// data指向创建的对象
							console.log('------');

							console.log(data);

							this.list_data.push(data);
						}
					})
				// 修改数据影响到页面
				// this.list_data.push(obj_data);
				// 任务添加成功 清空文本框


				this.$refs.inp.value = ''

			},
			toggleAll(ev) {
				// for (let i = 0; i < this.list_data.length; i++) {
				// 	// 反选
				// 	this.list_data[i].stat = this.list_data[i].stat;

				// }
				// 获取点击的元素
				// 将这个属性的值全部赋值给list_data中额stat
				for (let i = 0; i < this.list_data.length; i++) {
					this.list_data[i].stat = ev.target.checked;
				}
			},
			// 删除一个任务
			removeTodo(k, id) {
				axios.delete('http://localhost:3000/listdata/' + id)
					.then((backdata) => {
						let { data, status } = backdata
						if (status == 200) {
							this.list_data.splice(k, 1);
						}

					})

			},

			removeAllDone() {
				// for (let i = 0; i < list_data.length; i++) {
				// 	if (this.list_data[i].stat == true) {
				// 		this.list_data.splice(i, 1);
				// 	}
				// }
				// this.list_data = this.list_data.filter((v) => {
				// 	// 判断如果循环到的stat属性值为false
				// 	// 就是没有完成的任务
				// 	// if (v.stat == false)
				// 	// 	return true;
				// 	return !v.stat
				// })
				// 简写
				this.list_data = this.list_data.filter((v) => !v.stat);


			},
			// 完成任务
			todoDone(k, id) {
				var tmp_data = {}

				tmp_data.title = this.list_data[k].title
				tmp_data.stat = !this.list_data[k].stat

				axios.put('http://localhost:3000/listdata/' + id, tmp_data)
					.then((backdata) => {
						let { data, status } = backdata
						if (status == 200) {
							this.list_data[k].title = data.title
							this.list_data[k].stat = data.stat
						}
					})
			}

		}
	})

})(Vue);
