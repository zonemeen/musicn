const templateHtmlStr =
  '<html>\n' +
  '  <head>\n' +
  '    <meta charset="UTF-8" />\n' +
  '    <meta name="viewport" content="width=device-width,initial-scale=1.0" />\n' +
  '    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/ant-design-vue@1.7.8/dist/antd.min.css" />\n' +
  '    <script src="//cdn.jsdelivr.net/npm/vue@2"></script>\n' +
  '    <script src="//cdn.jsdelivr.net/npm/ant-design-vue@1.7.8/dist/antd.min.js"></script>\n' +
  '    <script src="//cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>\n' +
  '    <script src="//cdn.jsdelivr.net/npm/axios@1.3.4/dist/axios.min.js"></script>\n' +
  '    <style>\n' +
  '      .top {\n' +
  '        display: flex;\n' +
  '        align-items: center;\n' +
  '        justify-content: space-between;\n' +
  '        margin-bottom: 12px;\n' +
  '      }\n' +
  '      .anticon-left,\n' +
  '      .anticon-right {\n' +
  '        margin-top: 30%;\n' +
  '      }\n' +
  '      .ant-input-group-compact {\n' +
  '        text-align: right;\n' +
  '      }\n' +
  '      .ant-input-search-button {\n' +
  '        padding: 0 12px;\n' +
  '      }\n' +
  '    </style>\n' +
  '  </head>\n' +
  '\n' +
  '  <body>\n' +
  '    <div id="app">\n' +
  '      <a-card title="播放及下载音乐">\n' +
  '        <div class="top">\n' +
  '          <a-button\n' +
  '            style="padding: 0 10px"\n' +
  '            type="primary"\n' +
  '            :disabled="!selectedRowKeys.length"\n' +
  '            :loading="downLoading"\n' +
  '            @click="onDownload"\n' +
  '          >\n' +
  '            {{downLoading ? "下载ing" : "下载"}}\n' +
  '          </a-button>\n' +
  '          <div>\n' +
  '            <a-input-group compact>\n' +
  '              <a-select v-model="mode" :options="modes"></a-select>\n' +
  '              <a-select\n' +
  '                v-model="params.service"\n' +
  '                :options="services"\n' +
  '                @change="onParamsChange"\n' +
  '              ></a-select>\n' +
  '              <a-input-search\n' +
  '                v-model="params.text"\n' +
  '                placeholder="搜索"\n' +
  '                style="width: 48%; text-align: left"\n' +
  '                enter-button\n' +
  '                @search="onParamsChange"\n' +
  '              ></a-input-search>\n' +
  '            </a-input-group>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '        <a-table\n' +
  '          bordered\n' +
  '          :loading="loading"\n' +
  '          :row-selection="rowSelection"\n' +
  '          :scroll="{ y: scrollHeight }"\n' +
  '          :columns="columns"\n' +
  '          :data-source="dataSource"\n' +
  '          :pagination="pagination"\n' +
  '          @change="onParamsChange"\n' +
  '          :row-key="({songName, url, disabled, index}) => disabled ? index : `${songName}+${url}`"\n' +
  '        >\n' +
  '          <template slot="action" slot-scope="text, record, index">\n' +
  '            <a-button\n' +
  '              :disabled="record.disabled"\n' +
  '              type="primary"\n' +
  '              shape="circle"\n' +
  "              :icon=\"playIndex===index ? 'pause-circle' : 'play-circle'\"\n" +
  '              @click="onButtonClick(record, index)"\n' +
  '            />\n' +
  '          </template>\n' +
  '        </a-table>\n' +
  '        <audio ref="audioPlay" :controls="false" :src="voiceUrl" @ended="onAudioPlayEnd" />\n' +
  '      </a-card>\n' +
  '    </div>\n' +
  '    <script>\n' +
  '      Vue.use(antd)\n' +
  '      new Vue({\n' +
  '        data() {\n' +
  '          return {\n' +
  '            dataSource: [],\n' +
  '            loading: false,\n' +
  '            downLoading: false,\n' +
  '            scrollHeight: window.innerHeight - 270,\n' +
  '            services: [\n' +
  '              {\n' +
  "                label: '咪咕',\n" +
  "                value: 'migu',\n" +
  '              },\n' +
  '              {\n' +
  "                label: '酷我',\n" +
  "                value: 'kuwo',\n" +
  '              },\n' +
  '              {\n' +
  "                label: '网易',\n" +
  "                value: 'wangyi',\n" +
  '              },\n' +
  '              {\n' +
  "                label: '酷狗',\n" +
  "                value: 'kugou',\n" +
  '              },\n' +
  '            ],\n' +
  '            modes: [\n' +
  '              {\n' +
  "                label: '循环',\n" +
  "                value: 'cycle',\n" +
  '              },\n' +
  '              {\n' +
  "                label: '单曲',\n" +
  "                value: 'single',\n" +
  '              },\n' +
  '            ],\n' +
  "            mode: 'cycle',\n" +
  '            params: {\n' +
  "              service: 'migu',\n" +
  '              pageNum: 1,\n' +
  "              text: '',\n" +
  '            },\n' +
  '            columns: [\n' +
  '              {\n' +
  "                title: '歌曲名称',\n" +
  "                dataIndex: 'songName',\n" +
  "                width: '75%',\n" +
  '              },\n' +
  '              {\n' +
  "                title: '播放',\n" +
  "                dataIndex: 'action',\n" +
  '                scopedSlots: {\n' +
  "                  customRender: 'action',\n" +
  '                },\n' +
  "                width: '25%',\n" +
  '              },\n' +
  '            ],\n' +
  '            pagination: {\n' +
  '              current: 1,\n' +
  '              pageSize: 20,\n' +
  '              showLessItems: true,\n' +
  '              total: 0,\n' +
  '            },\n' +
  '            selectedRowKeys: [],\n' +
  '            playIndex: null,\n' +
  "            voiceUrl: '',\n" +
  '          }\n' +
  '        },\n' +
  '        computed: {\n' +
  '          rowSelection() {\n' +
  '            return {\n' +
  '              selectedRowKeys: this.selectedRowKeys,\n' +
  '              onChange: (selectedRowKeys) => {\n' +
  '                this.selectedRowKeys = selectedRowKeys\n' +
  '              },\n' +
  '              getCheckboxProps: (record) => ({\n' +
  '                props: {\n' +
  '                  disabled: record.disabled,\n' +
  '                },\n' +
  '              }),\n' +
  '            }\n' +
  '          },\n' +
  '        },\n' +
  '        methods: {\n' +
  '          async getDataSource() {\n' +
  '            this.loading = true\n' +
  '            this.selectedRowKeys = []\n' +
  '            this.playIndex = null\n' +
  "            this.voiceUrl = ''\n" +
  '            this.$nextTick(() => this.$refs.audioPlay.pause())\n' +
  '            const res = await axios\n' +
  "              .get('/search', {\n" +
  '                params: this.params,\n' +
  '              })\n' +
  '              .finally(() => (this.loading = false))\n' +
  '            const { searchSongs, totalSongCount } = res.data\n' +
  '            this.dataSource = searchSongs\n' +
  '            this.pagination.total = ~~totalSongCount\n' +
  '          },\n' +
  '          onParamsChange({ current }) {\n' +
  '            this.params.pageNum = current ?? 1\n' +
  '            this.pagination.current = current ?? 1\n' +
  '            this.getDataSource()\n' +
  '          },\n' +
  '          onAudioPlayEnd() {\n' +
  "            if (this.mode === 'cycle') {\n" +
  '              let selectedOption\n' +
  '              while (!selectedOption || selectedOption.disabled) {\n' +
  '                this.playIndex =\n' +
  '                  (this.playIndex + 1 + this.dataSource.length) % this.dataSource.length\n' +
  '                selectedOption = this.dataSource[this.playIndex]\n' +
  '              }\n' +
  '              this.voiceUrl = selectedOption.url\n' +
  '              this.$nextTick(() => this.$refs.audioPlay.play())\n' +
  '              return\n' +
  '            }\n' +
  '            this.$nextTick(() => this.$refs.audioPlay.play())\n' +
  '          },\n' +
  '          onButtonClick({ songName, url }, index) {\n' +
  '            if (this.playIndex === index) {\n' +
  '              this.$nextTick(() => this.$refs.audioPlay.pause())\n' +
  '              this.playIndex = null\n' +
  '              return\n' +
  '            }\n' +
  '            this.playIndex = index\n' +
  '            this.voiceUrl = url\n' +
  '            this.$nextTick(() => this.$refs.audioPlay.play())\n' +
  '          },\n' +
  '          onDownload() {\n' +
  '            this.downLoading = true\n' +
  '            Promise.all(\n' +
  '              this.selectedRowKeys.map(async (key) => {\n' +
  "                const [songName, url] = key.split('+')\n" +
  '                const { data } = await axios.get(`/download?url=${url}`, {\n' +
  "                  responseType: 'blob',\n" +
  '                })\n' +
  '                saveAs(data, songName)\n' +
  '              })\n' +
  '            ).finally(() => (this.downLoading = false))\n' +
  '          },\n' +
  '        },\n' +
  "      }).$mount('#app')\n" +
  '    </script>\n' +
  '  </body>\n' +
  '</html>\n'

export default templateHtmlStr
