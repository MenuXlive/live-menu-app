import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, QrCode as QrCodeIcon, X } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ isOpen, onClose }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [menuUrl, setMenuUrl] = useState('');

    useEffect(() => {
        const url = window.location.origin;
        setMenuUrl(url);
    }, []);

    useEffect(() => {
        if (isOpen && menuUrl) {
            generateQRCode();
        }
    }, [isOpen, menuUrl]);

    const generateQRCode = async () => {
        if (!menuUrl) {
            console.error('No menu URL available');
            return;
        }

        try {
            console.log('Generating QR for:', menuUrl);

            const qrDataUrl = await QRCode.toDataURL(menuUrl, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'H'
            });

            setQrCodeUrl(qrDataUrl);
            console.log('QR code generated successfully');
        } catch (error) {
            console.error('QR generation error:', error);
            toast.error('Failed to generate QR code');
        }
    };

    const downloadQRCode = () => {
        if (!qrCodeUrl) {
            toast.error('QR code not ready');
            return;
        }

        try {
            const link = document.createElement('a');
            link.download = 'LiveBar-Menu-QR-Code.png';
            link.href = qrCodeUrl;
            link.click();
            toast.success('QR code downloaded!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-slate-800 border-slate-600">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-white flex items-center gap-2">
                            <QrCodeIcon className="h-5 w-5 text-cyan-400" />
                            Menu QR Code
                        </DialogTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-4 h-4 text-slate-300" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* QR Code Display */}
                    <div className="bg-white p-8 rounded-lg flex items-center justify-center min-h-[316px]">
                        {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="Menu QR Code" className="w-[300px] h-[300px]" />
                        ) : (
                            <p className="text-gray-500 text-sm">Generating QR code...</p>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <h3 className="text-white font-semibold mb-2">How to use:</h3>
                        <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Customers scan this QR code to view the menu</li>
                            <li>• Download and print for display</li>
                            <li>• Place on tables or promotional materials</li>
                        </ul>
                    </div>

                    {/* URL Display */}
                    <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                        <p className="text-xs text-slate-400 mb-1">Menu URL:</p>
                        <p className="text-slate-200 text-sm font-mono break-all">{menuUrl || 'Loading...'}</p>
                    </div>

                    {/* Download Button */}
                    <Button
                        onClick={downloadQRCode}
                        disabled={!qrCodeUrl}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
