import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  hash: true,
  publicPath: './',
  history: { type: 'memory' },
  routes: [
    {
      path: '/',
      component: '@/pages/layout/index',
      routes: [
        // {
        //   path: '/asr-one-sentence',
        //   component: '@/pages/layout/asrOneSentence/Test',
        //   title: '一句话识别_语音识别-云知声AI开放平台',
        // },
        // {
        //   path: '/asr-real-time',
        //   component: '@/pages/layout/asrRealTtime/Test',
        //   title: '实时语音转写_语音识别-云知声AI开放平台',
        // },
        // {
        //   path: '/sa-call-eval',
        //   component: '@/pages/layout/sacalleavl/index',
        //   title: '口语评测_英语口语评测_语音评测-云知声AI开放平台',
        // },
        // {
        //   path: '/asr-audio-file',
        //   component: '@/pages/layout/asrAudioFile/Test',
        //   title: '音频文件转写_英语口语评测_语音评测-云知声AI开放平台',
        // },
        {
          path: '/tts-short',
          component: '@/pages/layout/ttsShort/Test',
          title: '短文本语音合成_语音合成-云知声AI开放平台',
        },
        // {
        //   path: '/tts-long',
        //   component: '@/pages/layout/ttsLong/Test',
        //   title: '长文本语音合成_语音合成-云知声AI开放平台',
        // },
        {
          path: '/',
          redirect: '/tts-short',
        },
      ],
    },
  ],

  theme: {
    'primary-color': '#1564FF',
    'border-radius-base': '4px',
  },
});
