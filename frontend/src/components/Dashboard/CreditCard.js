import React, { useState } from 'react';
import api from '../../services/Api';
import CryptoJS from 'crypto-js';
import { Link } from 'react-router-dom';

const CreditCard = () => {
  const [cardData, setCardData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const secretKey = CryptoJS.enc.Utf8.parse('0123456789abcabcdefdef0123456789');
  const iv = CryptoJS.enc.Utf8.parse('abc9876543210def');

  const encrypt = (text) => {
    const encrypted = CryptoJS.AES.encrypt(text, secretKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  };

  const decrypt = (cipherText) => {
    const decrypted = CryptoJS.AES.decrypt(cipherText, secretKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  const maskCard = (num) => {
    if (!num) return '';
    const last4 = num.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const handleGetCreditCard = async () => {
    setError('');
    setCardData(null);
    setLoading(true);

    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');

    if (!token || !userID) {
      setError('User session not found. Please sign in.');
      setLoading(false);
      return;
    }

    try {
      const encryptedData = encrypt(userID);
      const response = await api.post(
        '/bank/get-credit-card',
        { encryptedData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const encryptedResponse = response.data?.encryptedData;
      if (!encryptedResponse) {
        throw new Error('No card data returned from server.');
      }

      const decrypted = JSON.parse(decrypt(encryptedResponse));

      setCardData({
        creditCard: decrypted.creditCard,
        creditCardCVV: decrypted.creditCardCVV,
        creditCardExpMonth: decrypted.creditCardExpMonth,
        creditCardExpYear: decrypted.creditCardExpYear,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve card details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // small ephemeral success feedback could be added later
    } catch {
      // ignore clipboard failures silently
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">
      <div className="w-full max-w-lg">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Saved Credit Card</h2>
              <Link
                to="/main"
                className="text-sm text-white/70 hover:text-white transition"
              >
                Back to Home
              </Link>
            </div>

            {error && (
              <div className="mb-4 px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-300 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/80">Card status</div>
                <div className="text-sm font-medium text-white/90">
                  {cardData ? 'Loaded' : 'Not loaded'}
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs uppercase opacity-80">Credit Card</div>
                    <div className="mt-3 text-xl font-medium tracking-widest">
                      {cardData ? maskCard(cardData.creditCard) : '**** **** **** ****'}
                    </div>
                    <div className="mt-2 text-sm text-white/80">
                      {cardData ? `Exp: ${cardData.creditCardExpMonth}/${cardData.creditCardExpYear}` : 'Exp: --/--'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs uppercase opacity-80">CVV</div>
                    <div className="mt-3 text-lg font-semibold">
                      {cardData ? '•••' : '•••'}
                    </div>
                    <div className="mt-2 text-xs text-white/80">Hidden for security</div>
                  </div>
                </div>
              </div>

              {cardData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => copyToClipboard(cardData.creditCard)}
                    className="w-full py-2 bg-white/6 border border-white/10 text-white rounded-lg hover:bg-white/8 transition"
                  >
                    Copy Card Number
                  </button>
                  <button
                    onClick={() => copyToClipboard(cardData.creditCardCVV)}
                    className="w-full py-2 bg-white/6 border border-white/10 text-white rounded-lg hover:bg-white/8 transition"
                  >
                    Copy CVV
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={handleGetCreditCard}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg shadow hover:scale-[1.01] transition disabled:opacity-60"
                >
                  {loading ? 'Retrieving...' : cardData ? 'Refresh Card' : 'Get Card'}
                </button>

                <button
                  onClick={() => { setCardData(null); setError(''); }}
                  className="flex-1 py-3 bg-white/6 border border-white/10 text-white rounded-lg hover:bg-white/8 transition"
                >
                  Clear
                </button>
              </div>

              {cardData && (
                <div className="mt-4 p-4 bg-white/3 border border-white/6 rounded-lg text-sm text-white/90">
                  <div><strong>Number:</strong> {cardData.creditCard}</div>
                  <div className="mt-1"><strong>CVV:</strong> {cardData.creditCardCVV}</div>
                  <div className="mt-1"><strong>Expires:</strong> {cardData.creditCardExpMonth}/{cardData.creditCardExpYear}</div>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/5 bg-gradient-to-t from-white/2 to-transparent">
            <div className="text-xs text-center text-white/60">
              Encrypted · Secure · Shown only when requested
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
