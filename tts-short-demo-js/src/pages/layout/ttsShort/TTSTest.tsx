import React, { useEffect, useRef, useState } from 'react';
import style from './tts.less';
import Speaker from './Speaker';
import { Slider, Button, Popover, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { QuestionCircleOutlined } from '@ant-design/icons';

import PCMPlayer from '@/utils/PCMPlayer';
import { sha256 } from 'js-sha256';
import { Config, AiCode } from '@/config';
interface Props {
  voiceList: Array<any>;
  maxLength: number;
}

let ws: any;
let player: any;
let timer: any;
export default ({ voiceList = [], maxLength = 500 }: Props) => {
  const [selected, setSelected] = useState<any>(
    voiceList.length > 0 ? voiceList[0] : null,
  );

  const { appKey, secret, path } = Config[AiCode.TTSShort];

  const [speed, setSpeed] = useState<number>(50);
  const [volume, setVolume] = useState<number>(50);
  const [pitch, setPitch] = useState<number>(50);
  const [bright, setBright] = useState<number>(50);
  useEffect(() => {
    if (voiceList.length > 0) {
      setSelected(voiceList[0]);
      if (voiceList[0].playText) {
        setPlayText(voiceList[0].playText);
      }
    }
  }, [voiceList]);

  const [playText, setPlayText] = useState<string>(
    '云知声智能科技股份有限公司，成立于2012年6月29日，是语音行业发展最快的移动互联网公司。',
  );

  function startWs() {
    const tm: number = +new Date();
    const sign = sha256(`${appKey}${tm}${secret}`).toUpperCase();

    let context: any;
    try {
      context = new window.AudioContext();
    } catch (e) {
      message.error('您当前的浏览器不支持Web Audio API ');
      return;
    }
    ws = new WebSocket(`${path}?appkey=${appKey}&time=${tm}&sign=${sign}`);

    ws.binaryType = 'arraybuffer';
    if (player) player.destroy();
    player = new PCMPlayer({
      inputCodec: 'Int16',
      channels: 1,
      sampleRate: 16000,
      flushTime: 100,
    });
    let dataCount = 0;
    let startTime: Date;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          format: 'pcm',
          vcn: selected.code,
          text: playText,
          sample: 16000,
          speed,
          volume,
          pitch,
          bright,
        }),
      );
      dataCount = 0;
      startTime = new Date();
    };

    ws.onmessage = (res: any) => {
      try {
        const result = JSON.parse(res.data);
        ws.close();
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      } catch (e) {
        dataCount += res.data.byteLength;
        player.feed(res.data);
      }
    };

    ws.onclose = () => {
      console.log('ws.onclose ');
      ws = null;
    };
  }

  return (
    <div className={style.tts}>
      <div className={style.voice}>
        <div className={style.speakers}>
          {voiceList.map((item: any) => {
            return (
              <Speaker
                key={item.code}
                onClick={() => {
                  setSelected(item);
                  if (item.playText) {
                    setPlayText(item.playText);
                  }
                  if (player) {
                    player.destroy();
                    player = null;
                  }
                }}
                {...item}
                isSelect={item.code === (selected && selected.code)}
              />
            );
          })}
        </div>
        <div className={style.settings}>
          <div className={style.row}>
            <span className={style.label}>音量：</span>
            <span className={style.tag}>小</span>
            <span className={style.slider}>
              <Slider
                value={volume}
                onChange={(v: number) => {
                  setVolume(v);
                }}
              />
            </span>
            <span className={style.tag}>大</span>
          </div>
          <div className={style.row}>
            <span className={style.label}>语速：</span>
            <span className={style.tag}>慢</span>
            <span className={style.slider}>
              <Slider
                value={speed}
                tipFormatter={(value: number | undefined = 50) => {
                  return (
                    <span> {Math.round((value + 50) / 10) / 10 + 'X'} </span>
                  );
                }}
                onChange={(v: number) => {
                  setSpeed(v);
                }}
              />
            </span>
            <span className={style.tag}>快</span>
          </div>
          <div className={style.row}>
            <span className={style.label}>
              音高：
              <Popover
                content="代表调子高低，人耳感受上越高则越尖，越低则越粗犷，此参数建议保持默认值。"
                overlayStyle={{ width: 215 }}
              >
                <QuestionCircleOutlined />
              </Popover>
            </span>
            <span className={style.tag}>低</span>
            <span className={style.slider}>
              <Slider
                value={pitch}
                onChange={(v: number) => {
                  setPitch(v);
                }}
              />
            </span>
            <span className={style.tag}>高</span>
          </div>
          <div className={style.row}>
            <span className={style.label}>
              亮度：
              <Popover
                content="代表声音的清晰程度，适当的提高亮度可以让声音听起来更加清晰，过度的增加则会导致细节丢失。此参数建议保持默认值。"
                overlayStyle={{ width: 215 }}
              >
                <QuestionCircleOutlined />
              </Popover>
            </span>
            <span className={style.tag}>低</span>
            <span className={style.slider}>
              <Slider
                value={bright}
                onChange={(v: number) => {
                  if (v < 50) {
                    setBright(50);
                  } else {
                    setBright(v);
                  }
                }}
              />
            </span>
            <span className={style.tag}>高</span>
          </div>
        </div>
      </div>
      <div className={style.textPlay}>
        <TextArea
          className={style.textarea}
          value={playText}
          onChange={(e: any) => {
            setPlayText(e.target.value);
          }}
          bordered={false}
          maxLength={maxLength}
        />
        <div className={style.btns}>
          <div className={style.textCount}>
            {playText.length}/{maxLength}
          </div>
          <Button
            type="primary"
            onClick={() => {
              startWs();
            }}
          >
            播放
          </Button>
        </div>
      </div>
    </div>
  );
};
