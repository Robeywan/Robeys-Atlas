Add-Type -AssemblyName System.IO.Compression.FileSystem
$cat=Get-Content data\owner-reading-leads.json -Raw|ConvertFrom-Json
$lead=Get-Content ..\tittabawassee-owner-study-extraction.json -Raw|ConvertFrom-Json
if(-not ($cat.documents.key -contains 'Tittabawassee_History_Culture_and_Timeline')){
$key='Tittabawassee_History_Culture_and_Timeline';$title='Tittabawassee Ojibwe communities: history, culture and timeline';$context='Owner-supplied study concerning Tittabawassee River communities and Saginaw Chippewa/Ojibwe context; identity and historical claims await original-source review.'
$links=@($lead.urls|ForEach-Object {[ordered]@{url=$_;title=$_;documentKey=$key;documentTitle=$title;contextNote=$context;addedAt='2026-10-24';reviewStatus='Awaiting original-source review'}})
$cat.documents+= [pscustomobject]@{key=$key;title=$title;originalIds=@(265);contextNote=$context;links=$links}
}
$studies=@();New-Item -ItemType Directory -Force dist\assets\studies|Out-Null
foreach($doc in $cat.documents){
$filename=$doc.key+'.docx';$src='C:\Users\georg\OneDrive\Desktop\'+$filename;if(-not(Test-Path -LiteralPath $src)){$src='C:\Users\georg\OneDrive\Desktop\Old Assignments\'+$filename}
$zip=[IO.Compression.ZipFile]::OpenRead($src)
try{
$r=[IO.StreamReader]::new($zip.GetEntry('word/document.xml').Open());[xml]$xml=$r.ReadToEnd();$r.Dispose();$ns=[Xml.XmlNamespaceManager]::new($xml.NameTable);$ns.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
if($xml.SelectNodes('//w:del|//w:ins',$ns).Count -gt 0 -or $zip.GetEntry('word/comments.xml')){throw "Unreviewed revisions/comments in $filename"}
$blocks=@();foreach($node in $xml.SelectSingleNode('//w:body',$ns).ChildNodes){
if($node.LocalName -eq 'p'){$text=($node.SelectNodes('.//w:t',$ns)|ForEach-Object {$_.InnerText})-join '';if($text.Trim()){$style=$node.SelectSingleNode('./w:pPr/w:pStyle',$ns);$blocks+= [ordered]@{type='paragraph';text=$text;style=if($style){$style.GetAttribute('val',$ns.LookupNamespace('w'))}else{''}}}}
elseif($node.LocalName -eq 'tbl'){$rows=@($node.SelectNodes('./w:tr',$ns)|ForEach-Object {$row=$_;,@($row.SelectNodes('./w:tc',$ns)|ForEach-Object {($_.SelectNodes('.//w:t',$ns)|ForEach-Object {$_.InnerText})-join ' '})});$blocks+=[ordered]@{type='table';rows=$rows}}
}
$media=@($zip.Entries|Where-Object {$_.FullName -like 'word/media/*'}).Count
}finally{$zip.Dispose()}
$dest=Join-Path 'dist\assets\studies' $filename;Copy-Item -LiteralPath $src -Destination $dest -Force
$copy=[IO.Compression.ZipFile]::Open($dest,[IO.Compression.ZipArchiveMode]::Update)
try{$entry=$copy.GetEntry('docProps/core.xml');if($entry){$r=[IO.StreamReader]::new($entry.Open());[xml]$core=$r.ReadToEnd();$r.Dispose();foreach($n in @($core.DocumentElement.ChildNodes)){if($n.LocalName -in @('creator','lastModifiedBy')){$n.InnerText=''}};$entry.Delete();$new=$copy.CreateEntry('docProps/core.xml');$w=[IO.StreamWriter]::new($new.Open());$w.Write($core.OuterXml);$w.Dispose()}}finally{$copy.Dispose()}
$studies+=[ordered]@{key=$doc.key;title=$doc.title;originalIds=@($doc.originalIds);contextNote=$doc.contextNote;download='assets/studies/'+$filename;blocks=$blocks;embeddedMedia=$media;wordDownloadNote='Study text retained; author/editor file metadata cleared for public download. Online text preserves paragraphs and table content; use the Word download for original layout and any embedded media.'}
}
$cat|ConvertTo-Json -Depth 18|Set-Content data\owner-reading-leads.json -Encoding utf8
$studies|ConvertTo-Json -Depth 18|Set-Content data\owner-studies.json -Encoding utf8
'Prepared '+$studies.Count+' studies; paragraph/table blocks: '+(($studies|ForEach-Object {$_.blocks.Count}|Measure-Object -Sum).Sum)
'Embedded media: '+(($studies|ForEach-Object {$_.embeddedMedia}|Measure-Object -Sum).Sum)
