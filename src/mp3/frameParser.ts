import {
  BITRATE_MASK,
  FRAME_HEADER_SIZE,
  LAYER_MASK,
  LAYER3_BITS,
  MPEG1_LAYER3_BITRATES_KBPS,
  MPEG1_SAMPLE_RATES,
  MPEG1_VERSION_BITS,
  PADDING_MASK,
  SAMPLE_RATE_MASK,
  SYNC_BYTE1,
  SYNC_BYTE2_MASK,
  VERSION_MASK,
} from "./constants.ts";
import { FrameHeader } from "./types.ts";

export const parseFrameHeader = (buffer: Buffer, offset: number): FrameHeader | null => {
  if (offset + FRAME_HEADER_SIZE > buffer.length) {
    return null;
  }

  const b1 = buffer[offset];
  const b2 = buffer[offset + 1];
  const b3 = buffer[offset + 2];

  if (b1 === undefined || b2 === undefined || b3 === undefined) {
    return null;
  }

  if (b1 !== SYNC_BYTE1 || (b2 & SYNC_BYTE2_MASK) !== SYNC_BYTE2_MASK) {
    return null;
  }

  const versionBits = (b2 & VERSION_MASK) >> 3;
  if (versionBits !== MPEG1_VERSION_BITS) {
    return null;
  }

  const layerBits = (b2 & LAYER_MASK) >> 1;
  if (layerBits !== LAYER3_BITS) {
    return null;
  }

  const bitrateIndex = (b3 & BITRATE_MASK) >> 4;
  const bitrateKbps: number = MPEG1_LAYER3_BITRATES_KBPS[bitrateIndex] ?? 0;
  if (bitrateKbps === 0) {
    return null;
  }

  const sampleRateIndex = (b3 & SAMPLE_RATE_MASK) >> 2;
  const sampleRate: number = MPEG1_SAMPLE_RATES[sampleRateIndex] ?? 0;
  if (sampleRate === 0) {
    return null;
  }

  const paddingBit = (b3 & PADDING_MASK) >> 1;
  const bitrate = bitrateKbps * 1000;
  const frameLength = Math.floor((144 * bitrate) / sampleRate) + paddingBit;

  return {
    bitrate,
    sampleRate,
    padding: paddingBit,
    frameLength,
  };
};
