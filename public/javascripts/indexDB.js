const idxedDB = window.indexedDB;

// 브라우저에서 지원하는지 체크하기
if (!idxedDB) 
    window.alert('해당 브라우저에서는 indexedDB를 지원하지 않습니다.')
else {
    let db;
    const request = idxedDB.open('detailViewDB');   // 3. [DB명]](db) 열기
    
    request.onupgradeneeded =(e)=> { 
        db = e.target.result;
        db.createObjectStore('content', {keyPath: 'id'}); // 4. content저장소 만들고, key는 id로 지정
        request.onerror =(e)=> alert('failed');
        request.onsuccess =(e)=> db = request.result;  // 5. 성공시 db에 result를 저장
    }
}

/**
 * DB에 쓰기
 * 
 * @param {dict, 넣을 내용들} contents 
 */
// const contents = [{id: 1, content: 'a'}, {id: 2, content: 'b'}, {id: 3, content: 'c'}];
// writeIdxedDB(contents);
function writeIdxedDB(contents) {
    const request = window.indexedDB.open('detailViewDB');
    request.onerror =(e)=> {
        alert('DataBase error', e.target.errorCode);
    }
    request.onsuccess =(e)=> {
        const db = request.result;
        const transaction = db.transaction(['content'], 'readwrite');   // 읽기&쓰기 권한으로 transaction 생성

      // 완료, 실패 이벤트 처리
        transaction.oncomplete =(e)=> {
            console.log('success');
        }
        transaction.onerror =(e)=> {
            console.log('fail', e);
        }

      // transaction으로 
        const objStore = transaction.objectStore('content');
        for (const content of contents) {
        const request = objStore.add(content);   // 저장
        request.onsuccess =(e)=> console.log(e.target.result);
    }  
    }
}


/**
 * 원하는 Value 가지고 오기
 * @param {Value에 해당하는 key} key 
 */
//getIdxedDBValue(1);  // { id:1, content:"a" }
async function getIdxedDBValue(key) {
    return new Promise (resolve => {    // Promise를 통해 비동기 동작함으로써 데이터 return
        const request = window.indexedDB.open('detailViewDB');  // 1. DB 열기
        request.onerror =(e)=> console.log(e.target.errorCode);
    
        request.onsuccess =(e)=> {
            const db = request.result;
            const transaction = db.transaction('content');      
            transaction.onerror =(e)=> console.log('fail');
            transaction.oncomplete =(e)=> console.log('success');
    
            const objStore = transaction.objectStore('content');
            const objStoreRequest = objStore.get(key);        // 2. get으로 데이터 접근
            objStoreRequest.onsuccess = (e)=> {
                console.log(objStoreRequest.result)
                resolve(objStoreRequest.result);
            }
        }
    })

}

/**
 * 모든 값 가지고 오기 
 */
// getIdxedDBValues();  // { id:1, content:"a" }, {id: 2, content: 'b'}, {id: 3, content: 'c'}
async function getIdxedDBValues() {
    return new Promise (resolve => {// Promise를 통해 비동기 동작함으로써 데이터 return
        const request = window.indexedDB.open('detailViewDB');      // 1. DB 열기
        request.onerror =(e)=> console.log(e.target.errorCode);
    
        request.onsuccess =(e)=> {
            const db = request.result;
            const transaction = db.transaction('content');
            transaction.onerror =(e)=> console.log('fail');
            transaction.oncomplete =(e)=> console.log('success');
    
            const objStore = transaction.objectStore('content');    // 2. content 저장소 접근
            const cursorRequest = objStore.openCursor();
            cursorRequest.onsuccess =(e)=> {
                let cursor = e.target.result;
                if (cursor) {
                    const value = objStore.get(cursor.key);         // 3. 커서를 사용해 데이터 접근
                    value.onsuccess =(e)=> {
                        console.log(e.target.result);
                        resolve(e.target.result);
                    }
                    cursor.continue();                              // 4. cursor로 순회
                }
            }
        }
    })

}

/**
 * DB의 데이터 수정
 * @param {key} key 
 * @param {{key : key, value : value}} value 
 */
// updateIdxedDBValue(1, {id: 1, content: 'vvvv'}); 
function updateIdxedDBValue(key, value) {
    const request = window.indexedDB.open('detailViewDB');  // 1. db 열기
    request.onerror =(e)=> console.log(e.target.errorCode);

    request.onsuccess =(e)=> {
        const db = request.result;
        const transaction = db.transaction('content', 'readwrite');
        transaction.onerror =(e)=> console.log('fail');
        transaction.oncomplete =(e)=> console.log('success');

        const objStore = transaction.objectStore('content');// 2. content 저장소 접근
        const objStoreRequest = objStore.get(key);       // 3. key값으로 데이터 접근
        objStoreRequest.onsuccess =(e)=> {
            const updateRequest = objStore.put(value);     // 4. 수정
            updateRequest.onerror =(e)=> console.log('udpate error');
            updateRequest.onsuccess =(e)=> console.log('success');
        }
    }
}

/**
 * DB 데이터 삭제
 * @param {key} key 
 */
// deleteIdxedDBValue(1);
function deleteIdxedDBValue(key) {
    const request = window.indexedDB.open('detailViewDB');     // 1. db 열기
    request.onerror =(e)=> console.log(e.target.errorCode);

    request.onsuccess =(e)=> {
        const db = request.result;
        const transaction = db.transaction('content', 'readwrite');
        transaction.onerror =(e)=> console.log('fail');
        transaction.oncomplete =(e)=> console.log('success');

        const objStore = transaction.objectStore('content');   // 2. content 저장소 접근
        const objStoreRequest = objStore.delete(key);       // 3. 삭제하기 
        objStoreRequest.onsuccess =(e)=> {
            console.log('deleted');
        }
    }
}

/**
 * DB 데이터 전체 삭제
 */
// clearIdxedDBValue();
function clearIdxedDBValue() {
    const request = window.indexedDB.open('detailViewDB');     // 1. db 열기
    request.onerror =(e)=> console.log(e.target.errorCode);

    request.onsuccess =(e)=> {
        const db = request.result;
        const transaction = db.transaction('content', 'readwrite');
        transaction.onerror =(e)=> console.log('fail');
        transaction.oncomplete =(e)=> console.log('success');

        const objStore = transaction.objectStore('content');   // 2. content 저장소 접근
        const objStoreRequest = objStore.clear();           // 3. 전체 삭제
        objStoreRequest.onsuccess =(e)=> {
            console.log('cleared');
        }
    }
}
export {writeIdxedDB, getIdxedDBValue, getIdxedDBValues, updateIdxedDBValue, deleteIdxedDBValue, clearIdxedDBValue}