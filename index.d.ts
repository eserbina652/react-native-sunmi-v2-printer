declare module "react-native-sunmi-v2-printer" {
  type TSetAlignmentsParam = 0 | 1 | 2;

  type TColsAlign = [
    TSetAlignmentsParam,
    TSetAlignmentsParam,
    TSetAlignmentsParam
  ];

  type FontName = "gh";

  /**
   * TQRSymbology - type description
   *
   * 0. UPC-A (Universal Product Code-A)
   * Description: Common USA & Canada QR. Used in retail to identify products
   * Format: 12-digits
   *
   * 1. UPC-E (Universal Product Code-E)
   * Description: light version of UPC-A for use in confined spaces.
   * Format: from 6 to 12 digits
   *
   * 2. JAN13 (EAN-13)
   * Description: Extantion UPC-A, commonly use in Europe.
   * Format: 13-digits
   *
   * 3. JAN8 (EAN-8)
   * Description: Short version of EAN-13. For small packages and products.
   * Format: 8-digits
   *
   * 4. CODE39
   * Description: Allow to use digits, letters and special symbols. Used in logistics & industrial applications
   * Format: Variable length.
   *
   * 5. ITF (Interleaved 2 of 5)
   * Description: Encodes numeric data using pairs of digits.
   * Format: Variable length but always even length
   *
   * 6. CODABAR
   * Description: Allow to use digits and some special symbols. Use in medicine and library's system.
   * Format: Variable length.
   *
   * 7. CODE93
   * Description: Allow to use more symbols than CODE39, includes digits & letters.
   * Used in systems that require dense encoding and a wider character set.
   *
   * Format: Variable length.
   *
   * 8. CODE128
   * Description: The most flexible format, allow to use all ASCII's symbols (letters, numbers, punctuation, control characters, and special characters.)
   * sed in transportation and packaging, where encoding of large volumes of information is required.
   *
   * Format: Variable length.
   */
  type TQRSymbology = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  /**
   * TQRTextPosition
   *
   * 0 - don't print text
   * 1 — print text above QR
   * 2 — print text under QR
   * 3 — print text above & under QR.
   */
  type TQRTextPosition = 0 | 1 | 2 | 3;

  interface TSunmiVPrinter {
    /**
     * printerInit - For printer initialize.
     * Resets logic program, but don't clear the data buffer,
     * so all tasks that wasn't done yet, will be continue after reset
     */

    printerInit: () => Promise<void>;

    /**
     * printerSelfChecking - Printer's owns checking (printing the test page).
     */
    printerSelfChecking: () => Promise<string | null>;

    /**
     * getPrinterSerialNo - Gets printer's serial number (it might failed the program by GPT)
     */
    getPrinterSerialNo: () => Promise<string>;

    getPrinterVersion: () => Promise<string>;

    /**
     * getPrinterModal - Gets printer's modEl
     */
    getPrinterModal: () => Promise<string>;

    /**
     * hasPrinter - Checks if the printer exists (it might failed the program by GPT)
     */
    hasPrinter: () => Promise<boolean>;

    getPrintedLength: () => Promise<string>;
    /**
     * lineWrap - Forced paper feed after one receipt was printed
     *
     * @param n - amount of forced strings
     */

    lineWrap: (n: number) => Promise<void>;

    /**
     * sendRAWData - Allow to manipulate the printer at the low level
     *
     * @param base64EncryptedData - byteCode string like '0x1D, 0x56, 0x01'
     *
     * @TextFormatting
     * Bold font:
     * On: 0x1B, 0x45, 0x01
     * Off: 0x1B, 0x45, 0x00
     *
     * Underline:
     * On: 0x1B, 0x2D, 0x01
     * Off: 0x1B, 0x2D, 0x00
     *
     * @TextAlignment
     * Left: 0x1B, 0x61, 0x00
     * Center: 0x1B, 0x61, 0x01
     * Right: 0x1B, 0x61, 0x02
     *
     * @PaperCutterControl
     * Full cut: 0x1D, 0x56, 0x00
     * Partial cutting: 0x1D, 0x56, 0x01
     *
     * @PaperFeedControl
     * Feed for a certain number of lines: 0x1B, 0x64, n,
     * where n is the number of lines.
     *
     * Forced feeding on n lines (line wrap): 0x1B, 0x64, n
     */

    sendRAWData: (base64EncryptedData: string) => Promise<void>;

    /**
     * @param alignment - can be 0(align-left), 1(center) or 2(right)
     */
    setAlignment: (alignment: TSetAlignmentsParam) => void;

    /**
     * setFontName - allow to use custom fonts (I'm not sure its possible)
     *
     * @param typeface - vector fonts
     */
    setFontName: (typeface: FontName) => Promise<void>;
    setFontSize: (fontSize: number) => Promise<void>;
    printTextWithFont: (
      text: string,
      typeface: string,
      fontSize: number
    ) => Promise<void>;

    /**
     * printColumnsText - allow to print a tables or similar
     *
     * @param colsTextArr - array of strings,
     * where every next string presents every next column
     *
     * @param colsWidthArr - array of numbers that represents column's width in symbols,
     * if the string'll be larger it'll be moved on the next line
     * (to the begin of the first column)
     *
     * @param colsAlign - array of alignment for each column
     */
    printColumnsText: (
      colsTextArr: string[],
      colsWidthArr: number[],
      colsAlign: TColsAlign
    ) => Promise<void>;

    /**
     * printBitmap - for printing images
     *
     * @param data - image(png/jpeg/svg/etc) in base64 format
     * @param width - in px
     * @param height - in px
     */
    printBitmap: (data: string, width: number, height: number) => Promise<void>;

    /**
     * printBarCode - method for printing one-dimensional QR-code
     * @param data - QR-data
     * @param symbology - TQRSymbology type has necessary description
     * @param height - number from 1 tо 255, default value: 162
     * @param width - number from 2 tо 6, default value: 2.
     * @param textPosition - TQRTextPosition has necessary description
     *
     * @returns
     */
    printBarCode: (
      data: string,
      symbology: number,
      height: number,
      width: number,
      textPosition: TQRTextPosition
    ) => Promise<void>;

    /**
     * printQRCode
     *
     * @param data - QR-data (url or text)
     * @param moduleSize - from 1 to 16
     * @param errorLevel - from 0 to 3,
     * bigger number === better protection from damaging data but QR size be larger,
     * 0: recover to 7% damaged data.
     * 1: recover to 15% damaged data.
     * 2: recover to 25% damaged data.
     * 3: recover to 30% damaged data.
     */
    printQRCode: (data: string, moduleSize: number, errorLevel: number) => void;
    printOriginalText: (text: string) => Promise<void>;

    /**
     * commitPrinterBuffer - Send all printer's buffer to the print.
     */
    commitPrinterBuffer: () => Promise<string>;

    /**
     * enterPrinterBuffer
     *
     * @param clean - define is needed to clear the buffer before buffering starts
     */
    enterPrinterBuffer: (clean: boolean) => Promise<void>;

    /**
     * exitPrinterBuffer - for exit from print's buffering mode
     *
     * @param commit - is buffering data must be print
     */
    exitPrinterBuffer: (commit: boolean) => Promise<void>;
    printString: (message: string) => Promise<void>;
    clearBuffer: () => Promise<string>;
    exitPrinterBufferWithCallback: (
      commit: boolean,
      callback: (success: boolean) => void
    ) => Promise<void>;
  }
  const SunmiV2Printer: TSunmiVPrinter;
  export default SunmiV2Printer;
}
