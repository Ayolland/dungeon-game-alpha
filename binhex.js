var binhex = {
    /**
     * Converts binary code to hexadecimal string
     * @param {string} binaryString A string containing binary numbers e.g. '01001101'
     * @return {string} A string containing the hexadecimal numbers
     */
    convertBinaryToHexadecimal: function(binaryString)
    {
        var output = '';

        // For every 4 bits in the binary string
        for (var i=0; i < binaryString.length; i+=4)
        {
            // Grab a chunk of 4 bits
            var bytes = binaryString.substr(i, 4);

            // Convert to decimal then hexadecimal
            var decimal = parseInt(bytes, 2);
            var hex = decimal.toString(16);

            // Uppercase all the letters and append to output
            output += hex.toUpperCase();
        }

        return output;      
    },

    /**
     * Converts hexadecimal code to binary code
     * @param {string} A string containing single digit hexadecimal numbers
     * @return {string} A string containing binary numbers
     */
    convertHexadecimalToBinary: function(hexString)
    {
        var output = '';

        // For each hexadecimal character
        for (var i=0; i < hexString.length; i++)
        {
            // Convert to decimal
            var decimal = parseInt(hexString.charAt(i), 16);

            // Convert to binary and add 0s onto the left as necessary to make up to 4 bits
            var binary = this.leftPadding(decimal.toString(2), '0', 4);

            // Append to string         
            output += binary;
        }

        return output;
    },

    /**
     * Left pad a string with a certain character to a total number of characters
     * @param {string} inputString The string to be padded
     * @param {string} padCharacter The character that the string should be padded with
     * @param {string} totalCharacters The length of string that's required
     * @returns {string} A string with characters appended to the front of it
     */
    leftPadding: function(inputString, padCharacter, totalCharacters)
    {
        // If the string is already the right length, just return it
        if (!inputString || !padCharacter || inputString.length >= totalCharacters)
        {
            return inputString;
        }

        // Work out how many extra characters we need to add to the string
        var charsToAdd = (totalCharacters - inputString.length)/padCharacter.length;

        // Add padding onto the string
        for (var i = 0; i < charsToAdd; i++)
        {
            inputString = padCharacter + inputString;
        }

        return inputString;
    }
};