import { SlideItem, LectureData } from '../types';

export function generateGoogleAppsScript(lecture: LectureData): string {
  // Compress slides into an array of objects to keep it clean and robust
  const slidesJson = JSON.stringify(
    lecture.slides.map(s => ({
      slide: s.slideNumber,
      title: s.title,
      notes: s.narration
    })),
    null,
    2
  );

  return `/**
 * Google Apps Script for Google Slides
 * Course: ${lecture.course}
 * Presentation: ${lecture.title}
 * Presenter: ${lecture.author}
 * Total Slides: ${lecture.totalSlides}
 * 
 * INSTRUCTIONS:
 * 1. In your Google Slides presentation, open: Extensions > Apps Script
 * 2. Delete any default code in Code.gs, paste this entire script, and click Save (disk icon).
 * 3. Select 'syncSpeakerNotes' in the function dropdown and click 'Run'.
 * 4. Grant permissions when prompted.
 * 5. All ${lecture.totalSlides} slides will have their speaker notes populated with the voice narration script!
 */

const LECTURE_SLIDES = ${slidesJson};

function syncSpeakerNotes() {
  const presentation = SlidesApp.getActivePresentation();
  const slides = presentation.getSlides();
  
  Logger.log("Found " + slides.length + " slides in presentation. Preparing to sync " + LECTURE_SLIDES.length + " notes entries...");
  
  if (slides.length < LECTURE_SLIDES.length) {
    Logger.log("WARNING: Presentation has " + slides.length + " slides, but script has " + LECTURE_SLIDES.length + " narration scripts.");
  }
  
  let updatedCount = 0;
  
  for (let i = 0; i < LECTURE_SLIDES.length; i++) {
    if (i >= slides.length) {
      Logger.log("Stopping: reached end of presentation slides at index " + i);
      break;
    }
    
    const slide = slides[i];
    const item = LECTURE_SLIDES[i];
    const notesPage = slide.getNotesPage();
    const speakerNotesShape = notesPage.getSpeakerNotesShape();
    
    const formattedNotes = "SLIDE " + item.slide + " — " + item.title + "\\n\\n" + item.notes;
    speakerNotesShape.getText().setText(formattedNotes);
    updatedCount++;
  }
  
  const ui = SlidesApp.getUi();
  ui.alert("Success! " + updatedCount + " slide speaker notes updated with voice narration scripts.");
}

/**
 * Optional Helper: Attaches Google Drive Audio URLs to Speaker Notes
 * If you upload generated slide_1.mp3, slide_2.mp3 into a Drive folder,
 * run this function with the Folder ID to append clickable audio links to notes!
 */
function linkDriveAudioToNotes(driveFolderId) {
  if (!driveFolderId || driveFolderId === "YOUR_DRIVE_FOLDER_ID_HERE") {
    SlidesApp.getUi().alert("Please specify a valid Google Drive Folder ID containing your slide audio files.");
    return;
  }
  
  const folder = DriveApp.getFolderById(driveFolderId);
  const files = folder.getFiles();
  const audioMap = {};
  
  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName();
    // match slide_1.mp3 or slide 1 or 01.mp3
    const match = name.match(/(\\d+)/);
    if (match) {
      const slideNum = parseInt(match[1], 10);
      audioMap[slideNum] = file.getUrl();
    }
  }
  
  const presentation = SlidesApp.getActivePresentation();
  const slides = presentation.getSlides();
  let linked = 0;
  
  for (let i = 0; i < slides.length; i++) {
    const slideNum = i + 1;
    if (audioMap[slideNum]) {
      const slide = slides[i];
      const speakerNotesShape = slide.getNotesPage().getSpeakerNotesShape();
      const currentText = speakerNotesShape.getText().asString();
      if (!currentText.includes("Audio Recording:")) {
        speakerNotesShape.getText().appendText("\\n\\n[Audio Recording: " + audioMap[slideNum] + "]");
        linked++;
      }
    }
  }
  
  SlidesApp.getUi().alert("Linked audio for " + linked + " slides.");
}
`;
}

export function generatePythonScript(lecture: LectureData): string {
  return `"""
Automated Google Slides & Drive Voice Integration Script
Course: ${lecture.course}
Lecture: ${lecture.title}
Total Slides: ${lecture.totalSlides}

Prerequisites:
  pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib

Setup:
  1. Download your credentials.json from Google Cloud Console (OAuth 2.0 Client ID)
  2. Put credentials.json in this directory
  3. Run: python sync_slides_voice.py --presentation_id YOUR_PRESENTATION_ID
"""

import os
import sys
import json
import argparse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/presentations',
    'https://www.googleapis.com/auth/drive'
]

LECTURE_DATA = ${JSON.stringify(
  lecture.slides.map(s => ({
    slide: s.slideNumber,
    title: s.title,
    notes: s.narration
  })),
  null,
  2
)}

def authenticate():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def sync_speaker_notes(presentation_id, creds):
    slides_service = build('slides', 'v1', credentials=creds)
    presentation = slides_service.presentations().get(presentationId=presentation_id).execute()
    slides = presentation.get('slides', [])
    
    print(f"Loaded presentation: '{presentation.get('title')}' with {len(slides)} slides.")
    
    requests = []
    
    for i, slide_obj in enumerate(slides):
        if i >= len(LECTURE_DATA):
            break
        slide_info = LECTURE_DATA[i]
        slide_notes_id = slide_obj.get('slideProperties', {}).get('notesPage', {}).get('notesProperties', {}).get('speakerNotesObjectId')
        
        # If speakerNotesObjectId exists, insert text
        if slide_notes_id:
            formatted_text = f"SLIDE {slide_info['slide']} — {slide_info['title']}\\n\\n{slide_info['notes']}"
            requests.append({
                'insertText': {
                    'objectId': slide_notes_id,
                    'text': formatted_text,
                    'insertionIndex': 0
                }
            })
            
    if requests:
        body = {'requests': requests}
        slides_service.presentations().batchUpdate(presentationId=presentation_id, body=body).execute()
        print(f"Successfully synced {len(requests)} speaker notes entries!")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Sync voice speaker notes to Google Slides")
    parser.add_argument('--presentation_id', required=True, help="Google Slides presentation ID from URL")
    args = parser.parse_args()
    
    creds = authenticate()
    sync_speaker_notes(args.presentation_id, creds)
`;
}
