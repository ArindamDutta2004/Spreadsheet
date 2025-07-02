import React, { useState } from 'react';
import { X, Share2, Copy, Mail, Link, Users, Eye, Edit3, Settings } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [shareLink, setShareLink] = useState('https://spreadsheet.example.com/shared/abc123');
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit' | 'admin'>('view');

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleSendEmail = () => {
    if (emailInput.trim()) {
      // Simulate sending email
      alert(`Invitation sent to ${emailInput}`);
      setEmailInput('');
    }
  };

  const getPermissionIcon = (perm: string) => {
    switch (perm) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'edit': return <Edit3 className="w-4 h-4" />;
      case 'admin': return <Settings className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Share Spreadsheet</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Share Link */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Share Link</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center space-x-1 ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Email Invitation */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Invite by Email</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value as 'view' | 'edit' | 'admin')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="view">View</option>
                  <option value="edit">Edit</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                onClick={handleSendEmail}
                disabled={!emailInput.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send Invitation</span>
              </button>
            </div>
          </div>

          {/* Current Collaborators */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Current Collaborators</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    BD
                  </div>
                  <span className="text-sm">Balaji Bhai (You)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Settings className="w-4 h-4" />
                  <span className="text-xs">Owner</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    SC
                  </div>
                  <span className="text-sm">Sophie Choudhury</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Edit3 className="w-4 h-4" />
                  <span className="text-xs">Edit</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    TP
                  </div>
                  <span className="text-sm">Tejas Pandey</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">View</span>
                </div>
              </div>
            </div>
          </div>

          {/* Permission Levels */}
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>View:</strong> Can view and comment</p>
            <p><strong>Edit:</strong> Can view, comment, and edit</p>
            <p><strong>Admin:</strong> Can manage sharing and permissions</p>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};