//notes from https://www.datavoyage.com/mpgscript/mpeghdr.htm , https://id3.org/id3v2.3.0#ID3v2_header and https://id3.org/ID3v1
export const MPEG1_LAYER3_BITRATES_KBPS = [
    0,   // 0000: free / invalid
    32,  // 0001
    40,  // 0010
    48,  // 0011
    56,  // 0100
    64,  // 0101
    80,  // 0110
    96,  // 0111
    112, // 1000
    128, // 1001
    160, // 1010
    192, // 1011
    224, // 1100
    256, // 1101
    320, // 1110
    0    // 1111: bad
  ] as const;
  
  export const MPEG1_SAMPLE_RATES = [
    44100, // 00
    48000, // 01
    32000, // 10
    0      // 11: reserved
  ] as const;
  
  export const ID3V2_HEADER_SIZE = 10;
  export const ID3V1_TAG_SIZE = 128;
  export const FRAME_HEADER_SIZE = 4;
  
  // bit masks for frame header parsing
  export const SYNC_BYTE1 = 0xff;
  export const SYNC_BYTE2_MASK = 0b1110_0000;
  export const VERSION_MASK = 0b0001_1000;
  export const LAYER_MASK = 0b0000_0110;
  export const BITRATE_MASK = 0b1111_0000;
  export const SAMPLE_RATE_MASK = 0b0000_1100;
  export const PADDING_MASK = 0b0000_0010;
  
  // expected values
  export const MPEG1_VERSION_BITS = 0b11;
  export const LAYER3_BITS = 0b01;