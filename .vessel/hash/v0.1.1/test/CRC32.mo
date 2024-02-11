import Blob "mo:base-0.7.3/Blob";
import Text "mo:base-0.7.3/Text";

import CRC32 "../src/CRC32";

assert(CRC32.checksum([171,205,1]) == 591393286);
assert(CRC32.checksum(Blob.toArray(Text.encodeUtf8("The quick brown fox jumps over the lazy dog"))) == 1095738169);
