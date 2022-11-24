const jsonData = {
	data: [
		{
			key:'1',
			title: '开始',
			icon: "",
			item: {
				key:'1-1',
				title:'正式开始',
				icon: "",
			},
			status: 'success',
			callback: (e)=> { this.pipeCallback(e) }
		},
		{
			key: '2',
			group:[
				{
					rootKey: '2',
					key:'2-1',
					title: '环境准备',
					icon: "",
					item: {
						key:'2-1-1',
						title:'环境要开始准备了环境要开始准备了环境要开始准备了',
						icon: "",
					},
					status: 'fail'
				},
				{
					rootKey: '2',
					key:'2-2',
					title: '环境准备22环境准备22环境准备22',
					icon: "",
					item: {
						key:'2-2-1',
						title:'环境要开始准备了环境准备22环境准备22',
						icon: "",
					},
					status: 'success'
				},
				{
					rootKey: '2',
					key:'2-3',
					title: '环境准备3333',
					icon: "",
					item: {
						key:'2-3-1',
						title:'环境要开始准备了',
						icon: "",
					},
					status: 'running'
				},
				{
					rootKey: '2',
					key:'2-4',
					title: '环境准备444',
					icon: "",
					item: {
						key:'2-4-1',
						title:'环境要开始准备了',
						icon: "",
					},
					status: 'ban'
				},
			],
			
		},
		{
			key:'3',
			group:[
				{
					rootKey: '3',
					key:'3-1',
					title: '环境准备',
					icon: "",
					item: {
						key:'3-1-1',
						title:'环境要开始准备了环境要开始准备了环境要开始准备了',
						icon: "",
					},
					status: 'fail'
				},
				{
					rootKey: '3',
					key:'3-2',
					title: '环境准备22环境准备22环境准备22',
					icon: "",
					item: {
						key:'3-2-1',
						title:'环境要开始准备了环境准备22环境准备22',
						icon: "",
					},
					status: 'success'
				},
				{
					rootKey: '3',
					key:'3-3',
					title: '环境准备3333',
					icon: "",
					item: {
						key:'3-3-1',
						title:'环境要开始准备了',
						icon: "",
					},
					status: 'running'
				},
				{
					rootKey: '3',
					key:'3-4',
					title: '环境准备444',
					icon: "",
					item: {
						key:'3-4-1',
						title:'环境要开始准备了',
						icon: "",
					},
					status: 'ban'
				},
			],
		},
		{
			key:'4',
			title: '结束',
			icon: "",
			item: {
				key:'4-1',
				title:'结束lalalallalalal啦啦啦啦',
				icon: "",
			},
			status: 'ban'
		},

	],
	title: [
		{
			key:'1',
			title:'',
			icon:''
		},
		{
			key: '2',
			title: '检查仓库类型打包上传检查仓库类型打包上传',// ()=>(<span>环境准备环境准备环境准""</span>),
			icon: "",

		},
		{
			key: '3',
			title: '检查仓库类型打包上传检查仓库类型打包上传',
			icon: "",

		},
		{
			key: '4',
			title: '检查仓库类型打包上传',
			icon: "",

		},
	]
};
export default jsonData;